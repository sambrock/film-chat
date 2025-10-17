import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '~/lib/utils';

const variants = cva('', {
  variants: {
    size: {
      default: 'rounded-xl p-2',
      sm: 'rounded-lg p-1',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type Props = React.ComponentProps<'div'> & VariantProps<typeof variants> & { asChild?: boolean };

export const Panel = ({ asChild, className, size, ...props }: Props) => {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      className={cn(
        'border-foreground-0/5 bg-background-0/95 relative shrink-0 grow-0 border shadow-[inset_0_1px_0px_rgba(255,255,255,0.15),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm',
        variants({ size }),
        className
      )}
      {...props}
    />
  );
};
