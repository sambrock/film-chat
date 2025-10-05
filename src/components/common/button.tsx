import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus-visible:ring-ring flex items-center font-medium whitespace-nowrap transition select-none focus:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'text-foreground-1 hover:bg-foreground-0/5',
        outline:
          'border-foreground-0/5 bg-background-2/80 text-foreground-1 hover:bg-foreground-0/10 border text-xs',
        transparent: 'text-foreground-3',
      },
      size: {
        default: 'h-8 rounded-md px-3 text-sm',
        sm: 'h-6 justify-center rounded-md px-2 text-sm',
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
