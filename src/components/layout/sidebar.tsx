import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { SidebarButtonNewChat } from './sidebar-button-new-chat';
import { SidebarButtonWatchlist } from './sidebar-button-watchlist';
import { SidebarConversations } from './sidebar-conversations';

export const Sidebar = () => {
  return (
    <nav className="bg-background-0 border-foreground-0/5 h-screen w-[260px] shrink-0 grow-0 border-r p-2">
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

      <Suspense>
        <SidebarConversationsSuspense />
      </Suspense>
    </nav>
  );
};

const SidebarConversationsSuspense = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.conversations.queryOptions(undefined));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarConversations />
    </HydrationBoundary>
  );
};
