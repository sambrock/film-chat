import { Eye } from 'lucide-react';

import type { Library } from '~/lib/definitions';
import { useMutationUpdateLibrary } from '~/hooks/use-mutation-update-library';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { LibraryButton } from './library-button';

type Props = {
  movieId: string;
  library?: Library;
} & React.ComponentProps<typeof Button>;

export const LibraryButtonWatch = ({ movieId, library, ...props }: Props) => {
  const updateLibraryMutation = useMutationUpdateLibrary();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateLibraryMutation.mutate(
      library
        ? {
            ...library,
            watched: !library.watched,
            watchlist: library.watched ? library.watchlist : false, // if marking as watched, remove from watchlist
          }
        : {
            movieId,
            userId: '',
            liked: false,
            watched: true,
            watchlist: false,
            ignore: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
    );
  };

  return (
    <Tooltip>
      <TooltipContent>{library?.watched ? 'Unwatch' : 'Watched'}</TooltipContent>
      <TooltipTrigger asChild>
        <LibraryButton icon={Eye} active={library?.watched ?? false} onClick={handleClick} {...props} />
      </TooltipTrigger>
    </Tooltip>
  );
};
