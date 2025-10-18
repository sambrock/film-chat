import { Fragment, useLayoutEffect } from 'react';

import { cn } from '~/lib/utils';
import { useQueryGetChatMessages } from '~/hooks/use-query-get-chat-messages';
import { useChatContext } from './chat-context-provider';
import { ChatMessageAssistant } from './chat-message-assistant';
import { ChatMessageUser } from './chat-message-user';

type Props = React.ComponentProps<'div'>;

export const ChatMessages = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  const { data } = useQueryGetChatMessages(conversationId);

  const scrollToEnd = () => {
    if (!document) return;
    document.body.scrollIntoView({ behavior: 'instant', block: 'end' });
  };

  useLayoutEffect(() => {
    scrollToEnd();
  }, [data?.length]);

  return (
    <div className={cn('my-8 space-y-8', className)} {...props}>
      {data &&
        [...data].reverse().map((message) => (
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
