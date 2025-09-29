'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '../common/button';

type Props = ButtonProps & {
  href: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  isUnread?: boolean;
  isProcessing?: boolean;
};

export const SidebarButton = ({ icon, shortcut, isUnread, isProcessing, className, ...props }: Props) => {
  return (
    <Button
      variant="sidebar"
      size="default"
      className={cn('group gap-2 text-sm', className)}
      asChild
      {...props}
    >
      <Link href={props.href}>
        {icon && icon}
        <span className="mr-6 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.children}
        </span>

        <div className="ml-auto">
          {shortcut && (
            <span className="text-foreground-3 invisible font-medium antialiased group-hover:visible">
              {shortcut.join('')}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
};
