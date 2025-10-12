'use client';

import { and, count, eq, not, useLiveQuery } from '@tanstack/react-db';
import { Ellipsis, Pencil } from 'lucide-react';

import { chatsCollection, messagesCollection, recommendationsCollection } from '@/lib/collections';
import { cn, timeAgo } from '@/lib/utils';
import { useChatContext } from '@/providers/chat-context-provider';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';
import { Icon } from '../common/icon';
import { Header } from '../layout/header';

export const ChatHeader = () => {
  const { conversationId } = useChatContext();

  const chatQuery = useLiveQuery((q) =>
    q
      .from({ chats: chatsCollection })
      .where(({ chats }) => eq(chats.conversationId, conversationId))
      .findOne()
  );

  const countQuery = useLiveQuery((q) =>
    q
      .from({ messages: messagesCollection })
      .join(
        { recommendations: recommendationsCollection },
        ({ messages, recommendations }) => eq(messages.messageId, recommendations.messageId),
        'inner'
      )
      .where(({ messages, recommendations }) =>
        and(eq(messages.conversationId, conversationId), not(eq(recommendations.movieId, null)))
      )
      .select(({ recommendations }) => ({
        count: count(recommendations.recommendationId),
      }))
      .distinct()
  );

  const lastUpdatedAtQuery = useLiveQuery((q) =>
    q
      .from({ messages: messagesCollection })
      .where(({ messages }) => eq(messages.conversationId, conversationId))
      .orderBy(({ messages }) => messages.updatedAt, 'desc')
      .select(({ messages }) => ({
        updatedAt: messages.updatedAt,
      }))
      .findOne()
  );

  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));

  if (!chatQuery || !chatQuery.data) {
    return <div></div>;
  }
  return (
    <Header className="group bg-background-1/90 sticky border-b backdrop-blur-sm">
      <div className="text-foreground-0/80 text-sm font-medium">{chatQuery.data.title}</div>
      {countQuery.data?.[0]?.count && (
        <div className="text-foreground-1 text-xs font-medium">{countQuery.data[0].count} films</div>
      )}

      <div className="text-foreground-2 ml-auto text-xs font-medium">
        Updated {timeAgo(lastUpdatedAtQuery.data?.updatedAt || new Date())}
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
      <div className="bg-foreground-0/10 h-3 w-20 animate-pulse rounded"></div>
      <div className="bg-foreground-0/10 ml-auto h-2 w-24 animate-pulse rounded"></div>
      <div className="bg-foreground-0/10 h-8 w-8 rounded"></div>
    </Header>
  );
};
