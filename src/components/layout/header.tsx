import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'div'>;

export const Header = ({ className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'border-foreground-0/5 z-10 flex h-12 w-full items-center gap-4 border-b px-4',
        className
      )}
    >
      {props.children}
    </div>
  );
};
