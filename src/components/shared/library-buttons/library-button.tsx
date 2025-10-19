import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button, ButtonProps } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';

type Props = {
  icon: LucideIcon;
  active: boolean;
} & ButtonProps;

export const LibraryButton = ({ icon, active, onMouseDown, ...props }: Props) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleActiveAnimate = () => {
    if (active) {
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <Button
      className={cn(active && '')}
      size="icon"
      onMouseDown={(e) => {
        handleActiveAnimate();
        onMouseDown?.(e);
      }}
      {...props}
    >
      <div
        className={cn(
          'group ease-pop inline-block transition-all duration-400 [transition-timing-function:cubic-bezier(0.77,0,0.18,1)]',
          isAnimating && 'pointer-events-none scale-125'
        )}
      >
        <Icon
          icon={icon}
          size="sm"
          className={cn(
            'text-foreground-1 filter transition-all duration-400',
            !isAnimating
              ? 'drop-shadow-[0_0px_0px_rgba(24,225,157,0)]'
              : 'drop-shadow-[0_1px_2px_rgba(24,225,157,0.7)]',
            active && '!text-primary'
          )}
        />
      </div>
    </Button>
  );
};
