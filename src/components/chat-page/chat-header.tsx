import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { cn, timeAgo } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationDeleteChat } from '~/hooks/use-mutation-delete-chat';
import { useDerivedChat, useDerivedIsNewChat } from '~/hooks/use-query-get-chats';
import { Header } from '../shared/header';
import { Button } from '../ui/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../ui/dropdown';
import { Icon } from '../ui/icon';
import { useChatContext } from './chat-context-provider';

export const ChatHeader = () => {
  const { conversationId } = useChatContext();

  const chat = useDerivedChat(conversationId);
  const isNewChat = useDerivedIsNewChat(conversationId);

  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));

  const deleteConversationMutation = useMutationDeleteChat();

  const handleDelete = () => {
    if (!chat) return;
    deleteConversationMutation.mutate(chat.conversationId);
  };

  if (isNewChat) {
    return <div />;
  }
  if (!chat || !chat.title) {
    return <ChatHeaderSkeleton />;
  }
  return (
    <Header className="group bg-background-1/90 sticky border-b backdrop-blur-sm">
      <div className="text-foreground-0/80 text-sm font-medium">{chat.title}</div>

      <div className="text-foreground-2 ml-auto text-xs font-medium">
        Updated {timeAgo(chat.lastUpdateAt)}
      </div>

      <DropdownRoot>
        <DropdownTrigger asChild disabled={isProcessing}>
          <Button
            className={cn('group-focus-within:bg-foreground-0/5 text-sm')}
            disabled={isProcessing}
            size="icon"
          >
            <Icon icon={Ellipsis} />
          </Button>
        </DropdownTrigger>

        <DropdownContent className="min-w-60 origin-top-right" align="end" side="bottom" sideOffset={2}>
          <div className="text-foreground-1 my-1 px-2 text-xs font-medium select-none">Chat</div>

          <DropdownItem>
            <Icon icon={Pencil} size="xs" />
            <div className="text-sm font-medium">Rename</div>
          </DropdownItem>
          <DropdownItem onClick={handleDelete}>
            <Icon icon={Trash2} className="text-red-400" size="xs" />
            <div className="text-sm font-medium text-red-400">Delete</div>
          </DropdownItem>

          <hr className="bg-foreground-0/5 border-foreground-0/5 mx-2 my-1 h-px"></hr>

          <div className="text-foreground-2 px-2 py-1 text-xs select-none">
            Created {chat.createdAt && timeAgo(chat.createdAt)}
          </div>
        </DropdownContent>
      </DropdownRoot>
    </Header>
  );
};

export const ChatHeaderSkeleton = () => {
  return (
    <Header className="bg-background-1/90 sticky border-b backdrop-blur-sm">
      <div className="bg-foreground-0/10 h-4 w-32 animate-pulse rounded"></div>
      <div className="bg-foreground-0/10 ml-auto h-2 w-24 animate-pulse rounded"></div>
      <div className="bg-foreground-0/10 h-8 w-8 rounded-full"></div>
    </Header>
  );
};
