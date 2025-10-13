'use client';

import { useQueryGetChats } from '@/hooks/use-query-get-chats';
import { SidebarButtonChat } from './sidebar-button-chat';

export const SidebarChats = () => {
  const chatsQuery = useQueryGetChats();

  return (
    <>
      {chatsQuery.data
        ?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .map((chat) => (
          <SidebarButtonChat key={chat.conversationId} conversation={chat} />
        ))}
    </>
  );
};
