'use client';

import { ListVideo } from 'lucide-react';

import { SidebarButton } from './sidebar-button';

export const SidebarButtonWatchlist = () => {
  return (
    <SidebarButton
      href="/watchlist"
      className="w-full gap-2"
      icon={<ListVideo className="size-4.5 shrink-0" strokeWidth={2} />}
      // shortcut={['⌘', '⇧', 'W']}
    >
      Watchlist
    </SidebarButton>
  );
};
