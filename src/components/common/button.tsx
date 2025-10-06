import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const variants = cva(
  'focus-visible:ring-ring flex items-center font-sans font-medium whitespace-nowrap transition-all select-none focus:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default:
          'text-foreground-0 border-foreground-0/10 bg-background-1/60 hover:bg-background-2/90 border shadow-[inset_0_1px_0px_rgba(255,255,255,0.15),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm',
        ghost: 'text-foreground-1 hover:bg-foreground-0/10',
        transparent: 'text-foreground-1',
        sidebar: 'text-foreground-0 hover:bg-foreground-0/5',
      },
      size: {
        default: 'h-8 rounded-lg px-3 text-sm',
        sm: 'h-7 rounded-md px-2 text-xs',
        icon: 'size-8 justify-center rounded-full',
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

//   <button class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-white/2.5 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none transition antialiased">Button</button>
