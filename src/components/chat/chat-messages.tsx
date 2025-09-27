'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useConversationContext } from '@/providers/conversation-context-provider';
import { useQueryConversationHistory } from '@/hooks/use-query-conversation-history';
import { MessageAssistant } from './message-assistant';
import { MessageUser } from './message-user';

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
  }, [data.length]);

  return (
    <div
      id="chatMessages"
      ref={divRef}
      className={cn('mt-20 space-y-8 pb-20 lg:mt-12', className)}
      {...props}
    >
      {[...data].reverse().map((message) => (
        <Fragment key={message.messageId}>
          {message.role === 'user' && <MessageUser message={message} />}
          {message.role === 'assistant' && <MessageAssistant message={message} scrollToEnd={scrollToEnd} />}
        </Fragment>
      ))}
    </div>
  );
};
