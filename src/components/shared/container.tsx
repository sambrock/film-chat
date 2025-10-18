import { cn } from '~/lib/utils';

type Props = React.ComponentProps<'div'>;

export const Container = ({ className, ...props }: Props) => {
  return <div className={cn('debug px-3 ', className)}>{props.children}</div>;
};
