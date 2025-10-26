import type { Library, Movie } from '~/lib/definitions';
import { cn, tmdbPosterSrc } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { LibraryButtonLike } from '../shared/library-buttons/library-button-like';
import { LibraryButtonWatch } from '../shared/library-buttons/library-button-watch';
import { LibraryButtonWatchlist } from '../shared/library-buttons/library-button-watchlist';
import { MovieDetailsModal } from '../shared/movie-details-modal/movie-details-modal';
import { MovieDetailsModalContext } from '../shared/movie-details-modal/movie-details-modal-context-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type Props = {
  library: Library;
  movie: Movie;
};

export const LibraryMovieItem = ({ library, movie }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  const handleOpen = () => {
    dispatch({
      type: 'OPEN_MODAL_MOVIE_DETAILS',
      payload: { movieId: movie.movieId },
    });
  };

  return (
    <>
      <button
        className="group focus-visible:ring-ring relative rounded-md transition-opacity select-none focus-visible:ring-2 focus-visible:outline-none"
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            (e.currentTarget.nextElementSibling as HTMLElement | null)?.focus();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            (e.currentTarget.previousElementSibling as HTMLElement | null)?.focus();
          }
        }}
        data-movie-id={movie.movieId}
      >
        <Tooltip>
          <TooltipContent sideOffset={-14}>
            <div className="flex items-baseline">
              <div className="text-foreground/90 text-sm font-medium" title={movie.tmdb.title}>
                {movie.tmdb.title}
              </div>
              <div className="text-secondary-foreground ml-1 text-xs">
                {new Date(movie.tmdb.release_date!).getFullYear()}
              </div>
            </div>
          </TooltipContent>
          <TooltipTrigger asChild>
            <div className="hover:ring-primary/50 ring-border aspect-[1/1.5] w-full cursor-pointer overflow-clip rounded-md shadow-md ring-1 shadow-black/20 hover:ring-2">
              <img
                className={cn(
                  'object-fit h-full w-full brightness-90 transition-opacity select-none',
                  !library.watched && !library.liked && !library.watchlist && 'opacity-40'
                )}
                src={tmdbPosterSrc(movie.tmdb.poster_path!, 'w342')}
              />
            </div>
          </TooltipTrigger>
        </Tooltip>

        <div className="bg-background/5 absolute right-2 bottom-2 left-1/2 flex w-min -translate-x-1/2 items-center justify-between gap-0.5 rounded-full p-1 opacity-0 ring-1 ring-white/10 backdrop-blur-md group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
          <LibraryButtonWatchlist movieId={movie.movieId} library={library} />
          <LibraryButtonLike movieId={movie.movieId} library={library} />
          <LibraryButtonWatch movieId={movie.movieId} library={library} />
        </div>
      </button>

      <MovieDetailsModalContext value={{ library }}>
        <MovieDetailsModal movie={movie} />
      </MovieDetailsModalContext>
    </>
  );
};

export const LibraryMovieItemSkeleton = () => {
  return (
    <div className="bg-muted-background/20 aspect-[1/1.5] w-full animate-pulse overflow-clip rounded-md border" />
  );
};
