import { Heart } from 'lucide-react';

import type { Library } from '~/lib/definitions';
import { useMutationUpdateLibrary } from '~/hooks/use-mutation-update-library';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { LibraryButton } from './library-button';

type Props = {
  movieId: string;
  library?: Library;
} & React.ComponentProps<typeof Button>;

export const LibraryButtonLike = ({ movieId, library, ...props }: Props) => {
  const updateLibraryMutation = useMutationUpdateLibrary();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateLibraryMutation.mutate(
      library
        ? {
            ...library,
            liked: !library.liked,
            watched: !library.liked ? true : library.watched, // if liking, also mark as watched
          }
        : {
            movieId,
            userId: '',
            liked: true,
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
      <TooltipContent>{library?.liked ? 'Unlike' : 'Like'}</TooltipContent>
      <TooltipTrigger asChild>
        <LibraryButton icon={Heart} active={library?.liked ?? false} onClick={handleClick} {...props} />
      </TooltipTrigger>
    </Tooltip>
  );
};
