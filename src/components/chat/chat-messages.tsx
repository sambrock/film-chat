'use client';

import { useLayoutEffect, useRef } from 'react';
import { eq, useLiveQuery } from '@tanstack/react-db';

import { messagesCollection } from '@/lib/collections';
import { cn } from '@/lib/utils';
import { ChatMessageContextProvider, useChatContext } from './chat-context';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessages = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  // const { data } = useQueryConversationHistory(conversationId);

  const { data } = useLiveQuery((q) =>
    q.from({ message: messagesCollection }).where(({ message }) => eq(message.conversationId, conversationId))
  );

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
      {data &&
        data
          .sort((a, b) => a.serial - b.serial)
          .map((message) => (
            <ChatMessageContextProvider value={{ message }} key={message.messageId}>
              {message.role === 'user' && <ChatMessageUser message={message} />}
              {message.role === 'assistant' && (
                <ChatMessageAssistant message={message} scrollToEnd={scrollToEnd} />
              )}
            </ChatMessageContextProvider>
          ))}
    </div>
  );
};
