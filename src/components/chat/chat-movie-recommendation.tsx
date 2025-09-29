'use client';

import { Library, Movie, Recommendation } from '@/lib/definitions';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { TooltipProvider } from '../common/tooltip';

type Props = {
  recommendation: Recommendation;
  movie?: Movie;
  library?: Library;
};

export const ChatMovieRecommendation = ({ recommendation, movie, library }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  return (
    <div className="group border-foreground-0/5 flex cursor-pointer px-2 py-2 last:border-0">
      <div
        className={cn('bg-background-4 w-20 self-start overflow-clip rounded-sm md:aspect-[1/1.5] md:w-26')}
      >
        {movie && (
          <img
            className="object-fit"
            src={posterSrc(movie.tmdb.poster_path!, 'w185')}
            alt={movie.tmdb.title}
          />
        )}
      </div>

      <div className="ml-4 flex w-full flex-col py-2">
        <div
          className="mb-1 font-semibold"
          onClick={() => {
            if (!recommendation.movieId) return;
            dispatch({ type: 'OPEN_MOVIE_MODAL', payload: { movieId: recommendation.movieId } });
          }}
        >
          {recommendation.title}{' '}
          <span className="text-foreground-1 ml-1 text-xs font-medium">
            {recommendation.releaseYear ? recommendation.releaseYear : ''}
          </span>
        </div>
        <div className="text-foreground-1 text-sm md:max-w-3/4">{recommendation.why}</div>
        <div className="mt-2 flex items-baseline md:mt-auto">
          {movie && (
            <div className="text-foreground-1 mt-auto flex gap-3 text-xs font-medium">
              <span>{runtimeToHoursMins(movie.tmdb.runtime)}</span>
              <span>{movie.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {movie && (
        <TooltipProvider>
          <div className="ml-auto flex items-end gap-1">
            {/* <MovieWatchlistButton
              tmdbId={movie.tmdbId}
              title={movie.title}
              releaseDate={movie.releaseDate}
              posterPath={movie.posterPath}
            /> */}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};
