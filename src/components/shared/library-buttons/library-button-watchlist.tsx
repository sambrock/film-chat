import { Plus } from 'lucide-react';

import type { Library } from '~/lib/definitions';
import { useMutationUpdateLibrary } from '~/hooks/use-mutation-update-library';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { LibraryButton } from './library-button';

type Props = {
  movieId: string;
  library?: Library;
} & React.ComponentProps<typeof Button>;

export const LibraryButtonWatchlist = ({ movieId, library, ...props }: Props) => {
  const updateLibraryMutation = useMutationUpdateLibrary();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateLibraryMutation.mutate(
      library
        ? {
            ...library,
            watchlist: !library.watchlist,
          }
        : {
            movieId,
            userId: '',
            liked: false,
            watched: false,
            watchlist: true,
            ignore: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
    );
  };

  return (
    <Tooltip>
      <TooltipContent>{library?.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</TooltipContent>
      <TooltipTrigger asChild>
        <LibraryButton icon={Plus} active={library?.watchlist ?? false} onClick={handleClick} {...props} />
      </TooltipTrigger>
    </Tooltip>
  );
};
