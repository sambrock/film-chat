'use client';

import { Ellipsis, Pencil } from 'lucide-react';

import { cn, timeAgo } from '~/lib/utils';
import { useChatContext } from '~/providers/chat-context-provider';
import { useGlobalStore } from '~/providers/global-store-provider';
import { useQueryGetChat } from '~/hooks/use-query-get-chat';
import { useDerivedChatExists } from '~/hooks/use-query-get-chats';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';
import { Icon } from '../common/icon';
import { Header } from '../layout/header';

export const ChatHeader = () => {
  const { conversationId } = useChatContext();

  const chatQuery = useQueryGetChat(conversationId);
  const chatExists = useDerivedChatExists(conversationId);

  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));

  if (!chatExists) {
    return <div />;
  }
  if (!chatQuery || !chatQuery.data || !chatQuery.data.title) {
    return <ChatHeaderSkeleton />;
  }
  return (
    <Header className="group bg-background-1/90 sticky border-b backdrop-blur-sm">
      <div className="text-foreground-0/80 text-sm font-medium">{chatQuery.data.title}</div>

      <div className="text-foreground-2 ml-auto text-xs font-medium">
        Updated {timeAgo(chatQuery.data.lastUpdateAt)}
      </div>

      <DropdownRoot>
        <DropdownTrigger asChild disabled={isProcessing}>
          <Button
            className={cn('group-focus-within:bg-foreground-0/5 text-sm', isProcessing && 'hidden')}
            size="icon"
          >
            <Icon icon={Ellipsis} />
          </Button>
        </DropdownTrigger>

        <DropdownContent className="min-w-60 origin-top-left" align="end" side="bottom" sideOffset={2}>
          <div className="text-foreground-1 my-1 px-2 text-xs font-medium select-none">Chat</div>

          <DropdownItem>
            <Icon icon={Pencil} />
            <div className="text-sm font-medium">Rename</div>
          </DropdownItem>
          {/* <DropdownItem onClick={() => deleteConversationMutation.mutate({ conversationId })}>
            <Trash2 className="size-4 text-red-400" strokeWidth={2} />
            <div className="text-sm font-medium text-red-400">Delete</div>
          </DropdownItem> */}

          <hr className="bg-foreground-0/5 border-foreground-0/5 mx-2 my-1 h-px"></hr>

          <div className="text-foreground-2 px-2 py-1 text-xs select-none">
            Created {chatQuery.data.createdAt && timeAgo(chatQuery.data.createdAt)}
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
      <div className="bg-foreground-0/10 h-8 w-8 rounded"></div>
    </Header>
  );
};
