import Image from 'next/image';
import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { trpcClient } from '@/lib/trpc/client';
import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { Panel } from '../common/panel';
import { SidebarButtonNewChat } from './sidebar-button-new-chat';
import { SidebarButtonWatchlist } from './sidebar-button-watchlist';
import { SidebarChats } from './sidebar-chats';
import { db } from '@/lib/drizzle/db';

export const Sidebar = async () => {
  return (
    <Panel className="h-full w-[240px]">
      <div className="mb-3 px-3 py-2">
        <Link href="/">
          <Image
            className="relative z-[999] shrink-0 grow-0"
            src="/logo.svg"
            height={29.26}
            width={22}
            alt="Logo"
          />
        </Link>
      </div>

      <SidebarButtonNewChat />
      <SidebarButtonWatchlist />

      <div className="text-foreground-1 mt-6 mb-2 px-3 text-sm font-medium">Chats</div>

      <SuspenseSidebarChats />
    </Panel>
  );
};

const SuspenseSidebarChats = async () => {
  const queryClient = getQueryClient();
  // await queryClient.prefetchQuery(trpc.getChats.queryOptions(''));
  const data = await db.query.conversations.findMany({
    where: (conversations, { eq }) => eq(conversations.userId, 'gVVxQZzL2YQccyDd9E39ehIoB2LPWwlK'),
    orderBy: (conversations, { desc }) => [desc(conversations.lastUpdateAt)],
    limit: 20,
  });
  queryClient.setQueryData(trpc.getChats.queryKey(''), data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarChats />
    </HydrationBoundary>
  );
};
