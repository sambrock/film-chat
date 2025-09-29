'use client';

import { useLayoutEffect } from 'react';

import { Model, models } from '@/lib/ai/models';
import type { MessageAssistant } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { SpinnerEllipsis } from '../common/spinner';
import { ChatMovieRecommendation } from './chat-movie-recommendation';

type Props = {
  message: MessageAssistant;
  scrollToEnd: () => void;
} & React.ComponentProps<'div'>;

export const ChatMessageAssistant = ({ message, className, scrollToEnd, ...props }: Props) => {
  useLayoutEffect(() => {
    // Scroll to end when new content is added while processing
    if (message.content && message.status === 'processing') {
      scrollToEnd();
    }
  }, [message.content, message.status]);

  return (
    <div className={cn('mb-10', className)} {...props} data-message-id={message.messageId}>
      {message.status === 'processing' && message.recommendations.length === 0 && (
        <SpinnerEllipsis className="text-foreground-1 size-10" />
      )}

      {message.recommendations.length > 0 && (
        <div className="bg-background-0 divide-foreground-0/5 divide-y overflow-clip rounded-xl">
          {message.recommendations.map((recommendation, index) => (
            <ChatMovieRecommendation
              key={index}
              recommendation={recommendation}
              movie={message.movies.find((movie) => movie.movieId === recommendation.movieId)}
              library={message.library.find((library) => library.movieId === recommendation.movieId)}
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
