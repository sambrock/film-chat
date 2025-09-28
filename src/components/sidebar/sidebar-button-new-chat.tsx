'use client';

import Link from 'next/link';
import { SquarePen } from 'lucide-react';

import { SidebarButton } from './sidebar-button';

export const SidebarButtonNewChat = () => {
  return (
    <SidebarButton
      href="/"
      className="w-full gap-2"
      icon={<SquarePen className="size-4.5" strokeWidth={2} />}
      shortcut={['⌘', '⇧', 'O']}
      asChild
    >
      New Chat
    </SidebarButton>
  );
};
