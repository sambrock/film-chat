import { Link } from '@tanstack/react-router';

import { Panel } from '../ui/panel';
import { SidebarButtonLibrary } from './sidebar-button-library';
import { SidebarButtonNewChat } from './sidebar-button-new-chat';
import { SidebarChats } from './sidebar-chats';

type Props = React.ComponentProps<'div'>;

export const Sidebar = ({ ...props }: Props) => {
  return (
    <Panel {...props}>
      <div className="mb-3 px-3 py-2">
        <Link to="/">
          <img className="relative z-[999] size-8 shrink-0 grow-0" src="/logo.svg" alt="Logo" />
        </Link>
      </div>

      <SidebarButtonNewChat />
      <SidebarButtonLibrary />

      <div className="text-foreground-1 mt-6 mb-2 px-3 text-sm font-medium">Chats</div>

      <SidebarChats />
    </Panel>
  );
};
