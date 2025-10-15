'use client';

import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';
import { SidebarButtonChat } from './sidebar-button-chat';

export const SidebarChats = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getChats.queryOptions(''));

  return (
    <>
      {data
        ?.sort((a, b) => b.lastUpdateAt.getTime() - a.lastUpdateAt.getTime())
        .map((chat) => (
          <SidebarButtonChat key={chat.conversationId} conversation={chat} />
        ))}
    </>
  );
};
