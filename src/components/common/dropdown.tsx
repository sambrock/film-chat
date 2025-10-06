'use client';

import { DropdownMenu } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Panel } from './panel';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownPortal = DropdownMenu.Portal;

export const DropdownContent = ({ className, side, ...props }: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <Panel size="sm" asChild>
      <DropdownMenu.Content
        className={cn(
          'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:fade-out z-40 duration-75',
          className
          // side === 'top' &&
          //   'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-1 data-[state=closed]:fade-in data-[state=closed]:zoom-in-100 zoom-in-95',
          // side === 'top' &&
          //   'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-1 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
          // side === 'bottom' &&
          //   'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-1 data-[state=closed]:fade-in data-[state=closed]:zoom-in-100 zoom-in-95',
          // side === 'bottom' &&
          //   'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-1 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
        )}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        {...props}
      >
        {props.children}
      </DropdownMenu.Content>
    </Panel>
  );
};

export const DropdownItem = ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'focus:bg-foreground-0/5 text-foreground-0 flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm select-none focus:outline-none',
        className
      )}
      {...props}
    >
      {props.children}
    </DropdownMenu.Item>
  );
};
