import { Menu } from 'lucide-react';
import { Popover } from 'radix-ui';

import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import {
  Modal,
  ModalContent,
  ModalContentSidebar,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from '../ui/modal';
import { Sidebar } from './sidebar';

type Props = React.ComponentProps<'div'>;

export function Header({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        'group bg-background/90 sticky top-0 z-10 flex h-12 w-full shrink-0 items-center gap-4 border-b px-3 backdrop-blur-sm sm:px-4',
        className
      )}
    >
      {props.children}
    </div>
  );
}

const HeaderMenuButton = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          size="icon"
          className={cn('text-foreground/80 text-sm font-medium md:hidden', className)}
          {...props}
        >
          <Icon icon={Menu} size="sm" />
        </Button>
      </ModalTrigger>

      <ModalContentSidebar className="decoration-background fixed top-0 left-0 z-[999] h-screen w-[280px]">
        <ModalTitle className="sr-only">Menu</ModalTitle>
        <ModalDescription className="sr-only">App navigation menu</ModalDescription>
        <Sidebar className="h-screen w-full rounded-none rounded-r-xl border-y-0 border-l-0" />
      </ModalContentSidebar>
    </Modal>
  );
};

const HeaderTitle = ({ className, ...props }: React.ComponentProps<'h1'>) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <h1 className={cn('text-foreground/80 text-sm font-medium', className)} {...props}>
          {props.children}
        </h1>
      </Popover.Trigger>
      <Popover.Content></Popover.Content>
    </Popover.Root>
  );
};

const HeaderSkeleton = () => {
  return (
    <Header>
      <div className="bg-muted/60 h-4 w-32 animate-pulse rounded"></div>
    </Header>
  );
};

Header.MenuButton = HeaderMenuButton;
Header.Title = HeaderTitle;
Header.Skeleton = HeaderSkeleton;
