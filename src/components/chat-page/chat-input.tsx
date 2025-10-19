import { useLocation } from '@tanstack/react-router';
import { ArrowUp } from 'lucide-react';

import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationSendMessage } from '~/hooks/use-mutation-send-message';
import { useDerivedIsNewChat } from '~/hooks/use-query-get-chats';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Tooltip } from '../ui/tooltip';
import { useChatContext } from './chat-context-provider';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  const location = useLocation();

  const isNewChat = useDerivedIsNewChat(conversationId);

  const value = useGlobalStore((s) => s.inputValue.get(isNewChat ? 'new' : conversationId) || '');
  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));
  const dispatch = useGlobalStore((s) => s.dispatch);

  const isSendDisabled = isProcessing || !value.trim();

  const sendMessageMutation = useMutationSendMessage();

  const handleSubmit = () => {
    sendMessageMutation.mutate(value);
  };

  const handleInputChange = (value: string) => {
    dispatch({
      type: 'SET_CHAT_VALUE',
      payload: {
        conversationId: location.pathname === `/chat/${conversationId}` ? conversationId : 'new',
        value,
        isNewChat,
      },
    });
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
        id="chat-input"
        className="text-foreground-0 placeholder:text-foreground-1/80 my-2 w-full resize-none px-2 py-2 text-base focus:outline-none"
        placeholder="Type your message here..."
        value={value}
        rows={1}
        maxLength={250}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        autoFocus
      />

      <div className="flex items-center gap-1 py-1 pb-1">
        <ChatModelSelect />
        <Tooltip>
          <Tooltip.Content>{isSendDisabled ? 'Message requires text' : 'Send Message'}</Tooltip.Content>
          <Tooltip.Trigger asChild>
            <Button
              className={cn('ml-auto', isSendDisabled && 'cursor-not-allowed opacity-50')}
              size="icon"
              onClick={handleSubmit}
              disabled={isSendDisabled}
            >
              <Icon icon={ArrowUp} />
            </Button>
          </Tooltip.Trigger>
        </Tooltip>
      </div>
    </div>
  );
};
