import { useLocation } from '@tanstack/react-router';
import { SquarePen } from 'lucide-react';

import { cn } from '~/lib/utils';
import { SidebarButton } from './sidebar-button';

export const SidebarButtonNewChat = () => {
  const location = useLocation();

  return (
    <SidebarButton
      href="/"
      className={cn('w-full gap-2')}
      isActive={location.pathname === '/'}
      icon={<SquarePen className="size-4.5 shrink-0" strokeWidth={2} />}
    >
      New Chat
    </SidebarButton>
  );
};
