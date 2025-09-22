'use client';

import { cn } from '@/lib/utils';
import { useMessageContext } from '@/providers/message-context-provider';

type Props = React.ComponentProps<'div'>;

export const MessageUser = ({ className, ...props }: Props) => {
  const { message } = useMessageContext();

  return (
    <div
      className={cn(
        'bg-background-3 ml-auto w-max -mt-4 max-w-2/3 rounded-xl px-3 py-2 whitespace-pre-line',
        className
      )}
      {...props}
      data-message-id={message.messageId}
    >
      {message.content}
    </div>
  );
};
