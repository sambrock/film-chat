import type { Library, Movie, Recommendation } from '~/lib/definitions';
import { cn, genreName, runtimeToHoursMins, tmdbPosterSrc } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { TooltipProvider } from '../ui/tooltip';
import { LibraryButtonLike } from '../shared/library-buttons/library-button-like';
import { LibraryButtonWatch } from '../shared/library-buttons/library-button-watch';
import { LibraryButtonWatchlist } from '../shared/library-buttons/library-button-watchlist';
import { MovieDetailsModal } from '../shared/movie-details-modal/movie-details-modal';
import { MovieDetailsModalContextProvider } from '../shared/movie-details-modal/movie-details-modal-context-provider';

type Props = {
  recommendation: Recommendation;
  movie?: Movie;

  library?: Library;
};

export const ChatRecommendation = ({ recommendation, movie, library }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  const handleOpen = () => {
    if (!movie || !recommendation.movieId) return;
    dispatch({
      type: 'OPEN_MODAL_MOVIE_DETAILS',
      payload: { movieId: recommendation.movieId },
    });
  };

  return (
    <div className="group relative flex px-2 py-2">
      <div
        className={cn(
          'bg-secondary/40 w-20 shrink-0 self-start overflow-clip rounded-sm ring-1 ring-border transition-shadow md:aspect-[1/1.5] md:w-22',
          movie &&
            'focus-visible:ring-ring hover:ring-primary/50 group-hover:ring-2 group-hover:ring-white/10 focus:outline-none focus-visible:ring-2',
          movie && 'cursor-pointer shadow-md shadow-black/20',
          ''
        )}
        onClick={handleOpen}
        tabIndex={movie ? 0 : -1}
      >
        {movie && (
          <img
            className="object-fit h-full w-full"
            src={tmdbPosterSrc(movie.tmdb.poster_path!, 'w185')}
            alt={movie.tmdb.title}
          />
        )}
      </div>

      <div className="ml-4 flex w-full flex-col py-2">
        <div className="mb-1 flex flex-wrap items-baseline font-semibold">
          <span className="mr-1 max-w-4/5"> {recommendation.title} </span>
          <span className="text-secondary-foreground ml-1 text-xs font-medium">
            {recommendation.releaseYear ? recommendation.releaseYear : ''}
          </span>
        </div>
        <div className="text-secondary-foreground sm:text-sm md:max-w-3/4">{recommendation.why}</div>
        <div className="flex items-baseline md:mt-auto">
          {movie && (
            <div className="text-secondary-foreground mt-3 flex gap-3 text-xs font-medium sm:mt-auto">
              <span>{runtimeToHoursMins(movie.tmdb.runtime)}</span>
              <span>{movie.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {movie && (
        <div className="bg-background/5 absolute right-2 bottom-2 flex items-center justify-between gap-0.5 self-end rounded-full p-1 opacity-0 shadow ring-1 ring-white/10 backdrop-blur-md transition group-focus-within:opacity-100 group-hover:opacity-100 focus:opacity-100">
          <TooltipProvider>
            <LibraryButtonWatchlist movieId={movie.movieId} library={library} />
            <LibraryButtonLike movieId={movie.movieId} library={library} />
            <LibraryButtonWatch movieId={movie.movieId} library={library} />
          </TooltipProvider>
        </div>
      )}

      {movie && (
        <MovieDetailsModalContextProvider value={{ library }}>
          <MovieDetailsModal movie={movie} />
        </MovieDetailsModalContextProvider>
      )}
    </div>
  );
};
