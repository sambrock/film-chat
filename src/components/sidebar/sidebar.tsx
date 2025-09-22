import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { fetchQuery } from 'convex/nextjs';
import { SquarePen } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { cn } from '@/lib/utils';
import { SidebarButton } from './sidebar-button';
import { SidebarChats } from './sidebar-chats';
import { SidebarWatchlistButton } from './sidebar-watchlist-button';

type Props = React.ComponentProps<'div'>;

export const Sidebar = async ({ className, ...props }: Props) => {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  const [initialThreads, initialWatchlist] = await Promise.all([
    session ? fetchQuery(api.threads.getBySession, { session }) : null,
    session ? fetchQuery(api.watchlist.getBySession, { session }) : null,
  ]);

  return (
    <div className={cn('border-foreground-0/10 bg-background-0 h-screen border-r p-2', className)} {...props}>
      <div className="hidden p-3 lg:block">
        <Link
          href="/"
          className="focus-visible:ring-ring flex w-7 rounded-sm whitespace-nowrap transition select-none focus:outline-none focus-visible:ring-2"
        >
          <Image className="relative z-[999] w-7" src="/logo.svg" alt="Logo" width={28} height={38} />
        </Link>
      </div>

      <div className="mt-16 flex flex-col lg:mt-4">
        <SidebarButton asChild>
          <Link href="/" className="">
            <SquarePen className="mr-2 size-4.5" />
            New chat
          </Link>
        </SidebarButton>

        <SidebarWatchlistButton initialWatchlistCount={initialWatchlist?.length || 0} />
      </div>

      <div className="mt-4">
        <div className="text-foreground-1 px-3 py-1 text-sm">Chats</div>
        <SidebarChats initialData={initialThreads || []} />
      </div>
    </div>
  );
};
