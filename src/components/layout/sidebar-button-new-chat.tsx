'use client';

import { useLocation } from '@tanstack/react-router';
import { SquarePen } from 'lucide-react';

import { cn } from '~/lib/utils';
import { SidebarButton } from './sidebar-button';

export const SidebarButtonNewChat = () => {
  const location = useLocation();

  return (
    <SidebarButton
      href="/"
      className={cn('w-full gap-2', location.pathname === '/' && 'bg-foreground-0/5')}
      icon={<SquarePen className="size-4.5 shrink-0" strokeWidth={2} />}
      shortcut={['⌘', '⇧', 'O']}
      asChild
    >
      New Chat
    </SidebarButton>
  );
};
