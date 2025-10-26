import { useLocation, useNavigate } from '@tanstack/react-router';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import type { Conversation } from '~/lib/definitions';
import { cn, timeAgo } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationDeleteChat } from '~/hooks/use-mutation-delete-chat';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Icon } from '../ui/icon';
import { SpinnerEllipsis } from '../ui/spinner';
import { SidebarButton } from './sidebar-button';

type Props = {
  conversation: Conversation;
};

export const SidebarButtonChat = ({ conversation }: Props) => {
  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversation.conversationId));

  const dispatch = useGlobalStore((s) => s.dispatch);

  const location = useLocation();
  const navigate = useNavigate();
  const deleteChatMutation = useMutationDeleteChat();

  const handleDelete = () => {
    deleteChatMutation.mutate(conversation.conversationId);
  };

  return (
    <div className="group relative flex items-center">
      <SidebarButton
        className={cn('w-full gap-2')}
        href={`/chat/${conversation.conversationId}`}
        title={conversation.title}
        isActive={location.pathname === `/chat/${conversation.conversationId}`}
        asChild
      >
        {conversation.title || 'New chat'}
      </SidebarButton>

      {isProcessing && <SpinnerEllipsis className="text-secondary-foreground absolute right-4 size-5" />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isProcessing}>
          <Button
            variant="transparent"
            className={cn(
              'absolute top-0 right-2 -mr-2 ml-auto text-sm opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100',
              isProcessing && 'hidden'
            )}
            size="icon"
          >
            <Icon icon={Ellipsis} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="min-w-60 origin-top-left"
          align="start"
          side="bottom"
          sideOffset={2}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="text-secondary-foreground my-1 px-2 text-xs font-medium select-none">Chat</div>

          <DropdownMenuItem
            onSelect={() => {
              if (location.pathname !== `/chat/${conversation.conversationId}`) {
                navigate({
                  to: `/chat/${conversation.conversationId}`,
                });
              }
              requestAnimationFrame(() =>
                dispatch({
                  type: 'SET_RENAME_CHAT',
                  payload: { conversationId: conversation.conversationId },
                })
              );
            }}
          >
            <Icon icon={Pencil} size="xs" />
            <div className="text-sm font-medium">Rename</div>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>
            <Icon icon={Trash2} className="text-destructive" size="xs" />
            <div className="text-destructive text-sm font-medium">Delete</div>
          </DropdownMenuItem>

          <hr className="bg-foreground-0/5 border-foreground-0/5 mx-2 my-1 h-px"></hr>

          <div className="text-muted-foreground px-2 py-1 text-xs select-none">
            Created {conversation.createdAt && timeAgo(conversation.createdAt)}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
