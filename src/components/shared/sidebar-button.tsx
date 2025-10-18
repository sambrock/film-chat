import { Link } from '@tanstack/react-router';

import { cn } from '~/lib/utils';
import { Button, type ButtonProps } from '../ui/button';

type Props = ButtonProps & {
  href: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  isUnread?: boolean;
  isProcessing?: boolean;
};

export const SidebarButton = ({ icon, shortcut, isUnread, isProcessing, className, ...props }: Props) => {
  return (
    <Button variant="sidebar" className={cn('gap-2 text-sm', className)} asChild {...props}>
      <Link to={props.href} resetScroll={false}>
        {icon && icon}
        <span className="mr-6 w-full truncate">{props.children}</span>

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
