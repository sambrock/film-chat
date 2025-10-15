import { Link } from '@tanstack/react-router';

import { Panel } from '../common/panel';
import { SidebarButtonNewChat } from './sidebar-button-new-chat';
import { SidebarButtonWatchlist } from './sidebar-button-watchlist';
import { SidebarChats } from './sidebar-chats';

export const Sidebar = () => {
  return (
    <Panel className="h-full w-[240px]">
      <div className="mb-3 px-3 py-2">
        <Link to="/">
          <img className="relative z-[999] size-8 shrink-0 grow-0" src="/logo.svg" alt="Logo" />
        </Link>
      </div>

      <SidebarButtonNewChat />
      <SidebarButtonWatchlist />

      <div className="text-foreground-1 mt-6 mb-2 px-3 text-sm font-medium">Chats</div>

      <SidebarChats />
    </Panel>
  );
};
