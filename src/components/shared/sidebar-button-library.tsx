import { useLocation } from '@tanstack/react-router';
import { LibraryBig } from 'lucide-react';

import { cn } from '~/lib/utils';
import { SidebarButton } from './sidebar-button';

export const SidebarButtonLibrary = () => {
  const location = useLocation();

  return (
    <SidebarButton
      href="/library"
      className={cn('flex w-full gap-2')}
      isActive={location.pathname === '/library'}
      icon={<LibraryBig className="size-4.5 shrink-0" strokeWidth={2} />}
    >
      Library
    </SidebarButton>
  );
};
