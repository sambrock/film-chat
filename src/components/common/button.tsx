import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus-visible:ring-ring flex items-center font-medium whitespace-nowrap transition select-none focus:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'text-foreground-0/70 hover:bg-foreground-0/5 group-focus-within:bg-foreground-0/5',
        transparent: 'text-foreground-0/70',
      },
      size: {
        default: 'h-8 rounded-md px-3 text-sm',
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
