import { Link } from '@tanstack/react-router';

import { cn } from '~/lib/utils';
import { SidebarButtonLibrary } from './sidebar-button-library';
import { SidebarButtonNewChat } from './sidebar-button-new-chat';
import { SidebarChats } from './sidebar-chats';

type Props = React.ComponentProps<'div'>;

export const Sidebar = ({ className, ...props }: Props) => {
  return (
    <div className={cn(className, 'glass bg-sidebar rounded-xl border p-2')} {...props}>
      <div className="mb-3 px-3 py-2">
        <Link to="/">
          <img className="relative z-[999] size-8 shrink-0 grow-0" src="/logo.svg" alt="Logo" />
        </Link>
      </div>

      <SidebarButtonNewChat />
      <SidebarButtonLibrary />

      <div className="text-secondary-foreground mt-6 mb-2 px-3 text-sm font-medium">Chats</div>
      <SidebarChats />
    </div>
  );
};
