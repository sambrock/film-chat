'use client';

import type { MessageUser } from '~/lib/definitions';
import { cn } from '~/lib/utils';

type Props = { message: MessageUser } & React.ComponentProps<'div'>;

export const ChatMessageUser = ({ message, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'bg-background-3 -mt-4 ml-auto w-max max-w-2/3 rounded-xl px-3 py-2 whitespace-pre-line',
        className
      )}
      {...props}
      data-message-id={message.messageId}
    >
      {message.content}
    </div>
  );
};
