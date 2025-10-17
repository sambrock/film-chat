import { cn } from '~/lib/utils';

export const Carousel = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className="relative -mr-4 -ml-4">
      <div className="from-background-0 absolute top-0 left-0 z-10 h-full w-3 bg-gradient-to-r to-transparent"></div>
      <div className={cn('no-scrollbar relative snap-x snap-start', className)} {...props}>
        {props.children}
      </div>
      <div className="from-background-0 absolute top-0 right-0 z-10 h-full w-3 bg-gradient-to-l to-transparent"></div>
    </div>
  );
};

export const CarouselItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('snap-start scroll-ml-4 first:ml-4 last:mr-4', 'motion-safe:scroll-smooth', className)}
      {...props}
    >
      {props.children}
    </div>
  );
};
