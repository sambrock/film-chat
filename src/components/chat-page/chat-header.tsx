import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { useWindowSize } from 'usehooks-ts';

import { cn, timeAgo } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationDeleteChat } from '~/hooks/use-mutation-delete-chat';
import { useQueryGetChatsUtils } from '~/hooks/use-query-get-chats';
import { Header } from '../shared/header';
import { PopoverRenameChat } from '../shared/popover-rename-chat';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Icon } from '../ui/icon';
import { useChatContext } from './chat-context-provider';

export const ChatHeader = () => {
  const { conversationId } = useChatContext();

  const { getChat, isNewChat } = useQueryGetChatsUtils();
  const chat = getChat(conversationId);

  const width = useWindowSize();

  if (isNewChat(conversationId)) {
    if (width.width < 768) {
      return (
        <Header>
          <Header.MenuButton />
          <Header.Title>New chat</Header.Title>
        </Header>
      );
    }
    return null;
  }
  if (!chat || !chat.title) {
    return <Header.Skeleton />;
  }
  return (
    <Header>
      <Header.MenuButton />
      <PopoverRenameChat conversationId={conversationId} title={chat.title}>
        <Header.Title>{chat.title}</Header.Title>
      </PopoverRenameChat>

      <div className="md ml-auto flex items-center gap-4">
        <div className="text-muted-foreground hidden text-xs font-medium whitespace-nowrap sm:flex">
          Updated {timeAgo(chat.lastUpdateAt)}
        </div>

        <ChatHeaderOptions />
      </div>
    </Header>
  );
};

const ChatHeaderOptions = () => {
  const { conversationId } = useChatContext();

  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));
  const dispatch = useGlobalStore((s) => s.dispatch);

  const { getChat } = useQueryGetChatsUtils();
  const chat = getChat(conversationId);

  const deleteConversationMutation = useMutationDeleteChat();

  const handleDelete = () => {
    if (!chat) return;
    deleteConversationMutation.mutate(chat.conversationId);
  };

  if (!chat) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isProcessing}>
        <Button className={cn('text-sm')} disabled={isProcessing} size="icon">
          <Icon icon={Ellipsis} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="min-w-60 origin-top-right"
        align="end"
        side="bottom"
        sideOffset={2}
      >
        <div className="text-secondary-foreground my-1 px-2 text-xs font-medium select-none">Chat</div>

        <DropdownMenuItem
          onSelect={() => {
            dispatch({ type: 'SET_RENAME_CHAT', payload: { conversationId } });
          }}
        >
          <Icon icon={Pencil} size="xs" />
          <div className="text-sm font-medium">Rename</div>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleDelete}>
          <Icon icon={Trash2} className="text-red-400" size="xs" />
          <div className="text-sm font-medium text-red-400">Delete</div>
        </DropdownMenuItem>

        <hr className="bg-border border-foreground-0/5 mx-2 my-1 h-px"></hr>

        <div className="text-muted-foreground px-2 py-1 text-xs select-none">
          Created {chat.createdAt && timeAgo(chat.createdAt)}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
