import { useLayoutEffect } from 'react';

import { Model, models } from '~/lib/ai/models';
import { parseRecommendations } from '~/lib/ai/utils';
import type { MessageAssistant } from '~/lib/definitions';
import { cn } from '~/lib/utils';
import { SpinnerEllipsis } from '../ui/spinner';
import { ChatRecommendation } from './chat-recommendation';

type Props = {
  message: MessageAssistant;
  scrollToEnd: () => void;
} & React.ComponentProps<'div'>;

export const ChatMessageAssistant = ({ message, className, scrollToEnd, ...props }: Props) => {
  const getRecommendations = () => {
    if (message.recommendations && message.recommendations.length > 0) {
      return message.recommendations;
    }
    // Parse recommendations from message content as it streams in
    if (message.content) {
      return parseRecommendations(message.content) as MessageAssistant['recommendations'];
    }
    return [];
  };

  useLayoutEffect(() => {
    // Scroll to end when new content is added while processing
    if (message.content && message.status === 'processing') {
      scrollToEnd();
    }
  }, [message.content, message.status]);

  return (
    <div className={cn('mb-10', className)} {...props} data-message-id={message.messageId}>
      {message.status === 'processing' && getRecommendations().length === 0 && (
        <SpinnerEllipsis className="text-foreground-1 size-10" />
      )}

      {getRecommendations().length > 0 && (
        <div className="bg-background-0 divide-foreground-0/5 divide-y overflow-clip rounded-xl">
          {getRecommendations().map((recommendation, i) => (
            <ChatRecommendation
              key={recommendation.recommendationId || i}
              message={message}
              recommendation={recommendation}
              movie={message.movies.find((m) => m.movieId === recommendation.movieId)}
              library={message.libraries.find((m) => m.movieId === recommendation.movieId)}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'text-foreground-1 mt-4 flex px-2 text-xs',
          message.status === 'done' ? 'visible' : 'invisible'
        )}
        {...props}
      >
        <span className="font-medium">{models.get(message.model as Model)?.name}</span>
      </div>
    </div>
  );
};
