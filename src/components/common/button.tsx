import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus-visible:ring-ring flex items-center font-medium whitespace-nowrap transition select-none focus:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 hover:bg-surface-3 text-text-primary',
        transparent:
          'hover:bg-surface-3 focus-visible:text-foreground-0 hover:text-foreground-0 text-foreground-3 bg-transparent',
        ghost:
          'text-foreground-1 hover:text-foreground-0 hover:bg-foreground-1/20 focus-visible:bg-foreground-1/20 focus-visible:text-foreground-0',
        'ghost-2':
          'text-foreground-3 hover:text-foreground-0 hover:bg-foreground-1/20 focus-visible:bg-foreground-1/20 focus-visible:text-foreground-0',
        outline:
          'text-foreground-1 hover:text-foreground-0 hover:bg-foreground-1/20 border-foreground-0/5 border',
        primary: 'text-primary bg-primary/10',
        sidebar:
          'text-foreground-2 hover:text-foreground-0 hover:bg-foreground-0/5 w-full justify-start rounded-md bg-transparent px-3 py-2',
      },
      size: {
        default: 'h-9 rounded-md px-2 py-2 text-sm',
        xs: 'h-7 gap-1.5 rounded-md px-2',
        sm: 'h-8 gap-1.5 rounded-md px-2',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-8 justify-center rounded-md',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof variants> & { asChild?: boolean };

export const Button = ({ asChild, variant, size, className, disabled, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp className={variants({ className, variant, size, disabled })} disabled={disabled} {...props}>
      {props.children}
    </Comp>
  );
};
