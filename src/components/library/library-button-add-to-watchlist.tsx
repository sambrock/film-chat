import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useMutationUpdateLibrary } from '@/hooks/use-mutation-update-library';
import { Button, ButtonProps } from '../common/button';

type Props = {
  movieId: string;
  watchlist: boolean;
  onMutate?: (variables: { movieId: string; watchlist?: boolean | undefined }) => void;
} & ButtonProps;

export const LibraryButtonAddToWatchlist = ({ movieId, watchlist, className, onMutate, ...props }: Props) => {
  const { mutate } = useMutationUpdateLibrary(onMutate);

  const handleClick = () => {
    mutate({ movieId: movieId, watchlist: !watchlist });
  };

  return (
    <Button className={cn(className)} variant="outline" size="sm" onClick={handleClick} {...props}>
      <Plus className="mr-1 -ml-1 size-4 shrink-0" strokeWidth={2.5} />
      Add to watchlist
    </Button>
  );
};
