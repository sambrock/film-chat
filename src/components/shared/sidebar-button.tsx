import { Link } from '@tanstack/react-router';

import { cn } from '~/lib/utils';
import { Button } from '../ui/button';

type Props = React.ComponentProps<typeof Button> & {
  href: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  isUnread?: boolean;
  isProcessing?: boolean;
  isActive?: boolean;
};

export const SidebarButton = ({
  icon,
  shortcut,
  isUnread,
  isProcessing,
  isActive,
  className,
  ...props
}: Props) => {
  return (
    <Button
      variant="ghost"
      className={cn('gap-2', isActive && 'bg-accent', className)}
      asChild
      {...props}
    >
      <Link to={props.href} resetScroll={false}>
        {icon && icon}
        <span className="mr-6 w-full truncate">{props.children}</span>

        <div className="ml-auto">
          {shortcut && (
            <span className="text-muted-foreground invisible font-medium antialiased group-hover:visible">
              {shortcut.join('')}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
};
