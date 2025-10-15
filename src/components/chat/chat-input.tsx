'use client';

import { useLocation } from '@tanstack/react-router';
import { ArrowUp } from 'lucide-react';

import { cn } from '~/lib/utils';
import { useChatContext } from '~/providers/chat-context-provider';
import { useGlobalStore } from '~/providers/global-store-provider';
import { useMutationSendMessage } from '~/hooks/use-mutation-send-message';
import { Button } from '../common/button';
import { Icon } from '../common/icon';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  const location = useLocation();

  const value = useGlobalStore(
    (s) => s.inputValue.get(location.pathname === `/chat/${conversationId}` ? conversationId : 'new') || ''
  );
  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));
  const dispatch = useGlobalStore((s) => s.dispatch);

  const isSendDisabled = isProcessing || !value.trim();

  const sendMessageMutation = useMutationSendMessage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'SET_CHAT_VALUE',
      payload: {
        conversationId: location.pathname === `/chat/${conversationId}` ? conversationId : 'new',
        value: e.target.value,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageMutation.mutate(value);
    }
  };

  return (
    <div
      className={cn(
        'border-foreground-0/10 bg-background-2/90 flex flex-col rounded-xl border px-2 shadow-[inset_0_1px_0px_rgba(255,255,255,0.3),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <textarea
        className="text-foreground-0 placeholder:text-foreground-1/80 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
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
          <Icon icon={ArrowUp} />
        </Button>
      </div>
    </div>
  );
};
