import Image from 'next/image';
import Link from 'next/link';

import { ClientOnly } from '../common/client-only';
import { Panel } from '../common/panel';
import { SidebarButtonNewChat } from './sidebar-button-new-chat';
import { SidebarButtonWatchlist } from './sidebar-button-watchlist';
import { SidebarChats } from './sidebar-chats';

export const Sidebar = () => {
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

      <ClientOnly>
        <SidebarChats />
      </ClientOnly>
    </Panel>
  );
};

// const SidebarChatsSuspense = async () => {
//   const queryClient = getQueryClient();
//   // await queryClient.prefetchQuery(trpc.syncChats.queryOptions());

//   return (
//     <ClientOnly>
//       <SidebarChats />
//     </ClientOnly>
//   );
// };
