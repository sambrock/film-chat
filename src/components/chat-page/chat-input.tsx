import { useLocation } from '@tanstack/react-router';
import { ArrowUp } from 'lucide-react';

import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationSendMessage } from '~/hooks/use-mutation-send-message';
import { useQueryGetChatsUtils } from '~/hooks/use-query-get-chats';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useChatContext } from './chat-context-provider';
import { ChatModelSelect } from './chat-model-select';

type Props = React.ComponentProps<'div'>;

export const ChatInput = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  const { isNewChat } = useQueryGetChatsUtils();

  const location = useLocation();

  const value = useGlobalStore(
    (s) => s.inputValue.get(isNewChat(conversationId) ? 'new' : conversationId) || ''
  );
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
        isNewChat: isNewChat(conversationId),
      },
    });
  };

  return (
    <div className={cn('bg-secondary/90 glass flex flex-col rounded-xl border px-2', className)} {...props}>
      <Textarea
        id="chat-input"
        className="mt-2 mb-1 min-h-10 w-full resize-none border-none px-2 py-2 focus:outline-none focus-visible:ring-0 md:text-base"
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
          <TooltipContent>{isSendDisabled ? 'Message requires text' : 'Send Message'}</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              className={cn('ml-auto', isSendDisabled && 'cursor-not-allowed opacity-50')}
              size="icon"
              onClick={handleSubmit}
              disabled={isSendDisabled}
            >
              <Icon icon={ArrowUp} />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </div>
    </div>
  );
};
