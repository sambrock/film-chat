import { cva, VariantProps } from 'class-variance-authority';
import { LucideProps, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const variants = cva('antialiased', {
  variants: {
    size: {
      default: 'size-5 stroke-[2.5]',
      sm: 'size-4.5 stroke-2',
      xs: 'size-4 stroke-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type Props = { icon: LucideIcon } & LucideProps & VariantProps<typeof variants>;

export const Icon = ({ className, size, icon, ...props }: Props) => {
  const Comp = icon;

  return <Comp className={cn(variants({ size }), className)} {...props} />;
};
