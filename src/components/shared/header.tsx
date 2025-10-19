import { cn } from '~/lib/utils';

type Props = React.ComponentProps<'div'>;

export function Header({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        'group bg-background-1/90 border-foreground-0/10 sticky top-0 z-10 flex h-12 w-full shrink-0 items-center gap-4 border-b px-4 backdrop-blur-sm',
        className
      )}
    >
      {props.children}
    </div>
  );
}

const HeaderTitle = ({ className, ...props }: React.ComponentProps<'h1'>) => {
  return (
    <h1 className={cn('text-foreground-0/80 text-sm font-medium', className)} {...props}>
      {props.children}
    </h1>
  );
};

const HeaderSkeleton = () => {
  return (
    <Header>
      <div className="bg-foreground-0/10 h-4 w-32 animate-pulse rounded"></div>
    </Header>
  );
};

Header.Title = HeaderTitle;
Header.Skeleton = HeaderSkeleton;
