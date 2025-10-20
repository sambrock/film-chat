import { DropdownMenu } from 'radix-ui';

import { cn } from '~/lib/utils';
import { Panel } from './panel';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownPortal = DropdownMenu.Portal;

export const DropdownContent = ({ className, side, ...props }: DropdownMenu.DropdownMenuContentProps) => {
  return (
    <DropdownPortal>
      <Panel size="sm" asChild>
        <DropdownMenu.Content
          className={cn(
            'z-50',
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
      </Panel>
    </DropdownPortal>
  );
};

export const DropdownItem = ({ className, disabled, ...props }: DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'focus:bg-foreground-0/5 text-foreground-0 flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm select-none focus:outline-none',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      {...(disabled ? { 'data-disabled': true } : {})}
      {...props}
    >
      {props.children}
    </DropdownMenu.Item>
  );
};
