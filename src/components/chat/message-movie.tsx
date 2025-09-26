'use client';

import type { MessageResponseMovie, Movie } from '@/lib/definitions';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { TooltipProvider } from '../common/tooltip';

type Props = {
  responseMovie: MessageResponseMovie;
  movie?: Movie;
};

export const MessageMovie = ({ responseMovie, movie }: Props) => {
  return (
    <div className="group border-foreground-0/5 flex cursor-pointer border-b-1 px-2 py-2 last:border-0">
      <div
        className={cn('bg-background-4 w-20 self-start overflow-clip rounded-sm md:aspect-[1/1.5] md:w-26')}
      >
        {movie && (
          <img
            className="object-fit"
            src={posterSrc(movie.source.poster_path!, 'w185')}
            alt={movie.source.title}
          />
        )}
      </div>

      <div className="ml-4 flex w-full flex-col py-2">
        <div className="mb-1 font-semibold">
          {responseMovie.title}{' '}
          <span className="text-foreground-1 ml-1 text-xs font-medium">
            {responseMovie.releaseYear ? responseMovie.releaseYear : ''}
          </span>
        </div>
        <div className="text-foreground-1 text-sm md:max-w-3/4">{responseMovie.why}</div>
        <div className="mt-2 flex items-baseline md:mt-auto">
          {movie && (
            <div className="text-foreground-1 mt-auto flex gap-3 text-xs font-medium">
              {/* <span>{runtimeToHoursMins(movie.source.runtime)}</span>
              <span>{movie.source.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span> */}
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
