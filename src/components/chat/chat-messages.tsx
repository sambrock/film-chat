'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useConversationContext } from '@/providers/conversation-context-provider';
import { useQueryConversationHistory } from '@/hooks/use-query-conversation-history';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessages = ({ className, ...props }: Props) => {
  const { conversationId } = useConversationContext();

  const { data } = useQueryConversationHistory(conversationId);

  const divRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    if (!divRef.current) return;
    divRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
  };

  useLayoutEffect(() => {
    scrollToEnd();
  }, [data?.length]);

  return (
    <div ref={divRef} className={cn('mt-20 space-y-8 pb-20 lg:mt-8', className)} {...props}>
      {data && [...data].reverse().map((message) => (
        <Fragment key={message.messageId}>
          {message.role === 'user' && <ChatMessageUser message={message} />}
          {message.role === 'assistant' && (
            <ChatMessageAssistant message={message} scrollToEnd={scrollToEnd} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
