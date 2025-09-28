'use client';

import { DropdownMenu } from 'radix-ui';

import { cn } from '@/lib/utils';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownPortal = DropdownMenu.Portal;

export const DropdownContent = ({ className, side, ...props }: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <DropdownMenu.Content
      className={cn(
        'bg-background-0 border-foreground-0/5 z-50 rounded-xl border p-1 shadow-lg shadow-black/10',
        side === 'top' &&
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-1 data-[state=closed]:fade-in data-[state=closed]:zoom-in-100 zoom-in-95',
        side === 'top' &&
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-1 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
        side === 'bottom' &&
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-1 data-[state=closed]:fade-in data-[state=closed]:zoom-in-100 zoom-in-95',
        side === 'bottom' &&
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
        className
      )}
      onCloseAutoFocus={(e) => {
        e.preventDefault();
      }}
      {...props}
    >
      {props.children}
    </DropdownMenu.Content>
  );
};

export const DropdownItem = ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'focus:bg-background-1 select-none text-foreground-2 flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm focus:outline-none',
        className
      )}
      {...props}
    >
      {props.children}
    </DropdownMenu.Item>
  );
};
