'use client';

import { useParams } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useMutationSendMessage } from '@/hooks/use-mutation-send-message';
import { Button } from '../common/button';
import { useChatContext } from './chat-context';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  const params = useParams<{ conversationId: string }>();

  const value = useGlobalStore(
    (s) => s.inputValue.get(params.conversationId === conversationId ? conversationId : 'new') || ''
  );
  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));
  const dispatch = useGlobalStore((s) => s.dispatch);

  const isSendDisabled = isProcessing || !value.trim();

  const sendMessage = useMutationSendMessage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'SET_CONVERSATION_VALUE',
      payload: {
        conversationId: params.conversationId === conversationId ? conversationId : 'new',
        value: e.target.value,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage.mutate(value);
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
          disabled={isSendDisabled}
        >
          <ArrowUp className="size-5" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};
