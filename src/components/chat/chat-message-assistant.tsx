'use client';

import { useLayoutEffect } from 'react';
import { eq, useLiveQuery } from '@tanstack/react-db';

import { Model, models } from '@/lib/ai/models';
import { recommendationsCollection } from '@/lib/collections';
import type { Message } from '@/lib/definitions';
import { cn, parseRecommendations } from '@/lib/utils';
import { SpinnerEllipsis } from '../common/spinner';
import { ChatRecommendation } from './chat-recommendation';

type Props = {
  message: Message;
  scrollToEnd: () => void;
} & React.ComponentProps<'div'>;

export const ChatMessageAssistant = ({ message, className, scrollToEnd, ...props }: Props) => {
  const { data } = useLiveQuery((q) =>
    q
      .from({ recommendation: recommendationsCollection })
      .where(({ recommendation }) => eq(recommendation.messageId, message.messageId))
  );

  const getRecommendations = () => {
    if (data && data.length > 0) {
      return data;
    }
    if (message.content) {
      return parseRecommendations(message.content);
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
      {message.status === 'processing' && data.length === 0 && (
        <SpinnerEllipsis className="text-foreground-1 size-10" />
      )}

      {getRecommendations().length > 0 && (
        <div className="bg-background-0 divide-foreground-0/5 divide-y overflow-clip rounded-xl">
          {getRecommendations().map((recommendation) => (
            <ChatRecommendation key={recommendation.recommendationId} recommendation={recommendation} />
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
