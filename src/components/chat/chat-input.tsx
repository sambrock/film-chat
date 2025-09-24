'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useThreadContext } from '@/providers/thread-context-provider';
import { Button } from '../common/button';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { threadId, getThreadIsPersisted } = useThreadContext();

  const value = useGlobalStore((s) => s.chatInputValue.get(threadId) || s.chatInputValue.get('new') || '');
  const isPending = useGlobalStore((s) => s.chatPending.has(threadId));
  const dispatch = useGlobalStore((s) => s.dispatch);

  const isSendDisabled = isPending || !value.trim();

  // const sendMessage = useApiSendMessage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'SET_INPUT_VALUE',
      payload: { threadId, value: e.target.value, isPersisted: getThreadIsPersisted() },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // sendMessage.mutate(value);
    }
  };

  return (
    <div
      className={cn('border-foreground-0/5 bg-background-2 flex flex-col rounded-xl border px-2', className)}
      {...props}
    >
      <textarea
        className="text-foreground-0 placeholder:text-foreground-0/35 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
        placeholder="Type your message here..."
        value={value}
        rows={1}
        maxLength={250}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      <div className="flex items-center gap-1 py-1 pb-1">
        <ChatModelSelect />
        <Button
          className={cn('ml-auto', isSendDisabled && 'pointer-events-none')}
          size="icon"
          variant="ghost"
          disabled={isSendDisabled}
        >
          <ArrowUp className="size-5" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};
