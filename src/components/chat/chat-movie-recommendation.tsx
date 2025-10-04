'use client';

import { PanelRight, PanelRightOpen } from 'lucide-react';

import { Library, Movie, Recommendation } from '@/lib/definitions';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { LibraryButtonWatchlist } from '../library/library-button-actions';

type Props = {
  messageId: string;
  recommendation: Recommendation;
  movie?: Movie;
  library?: Library;
};

export const ChatMovieRecommendation = ({ messageId, recommendation, movie, library }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  return (
    <div className="group relative border-foreground-0/5 flex px-2 py-2">
      <div
        className={cn(
          'bg-background-4 w-20 shrink-0 self-start overflow-clip rounded-sm md:aspect-[1/1.5] md:w-22'
        )}
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
          className="mb-1 flex flex-wrap items-baseline font-semibold"
          onClick={() => {
            if (!recommendation.movieId) return;
            dispatch({ type: 'OPEN_MOVIE_MODAL', payload: { movieId: recommendation.movieId } });
          }}
        >
          <span className="mr-1 max-w-4/5"> {recommendation.title} </span>
          <span className="text-foreground-1 ml-1 text-xs font-medium">
            {recommendation.releaseYear ? recommendation.releaseYear : ''}
          </span>
        </div>
        <div className="text-foreground-1 text-sm md:max-w-3/4">{recommendation.why}</div>
        <div className="flex items-baseline md:mt-auto">
          {movie && (
            <div className="text-foreground-1 mt-auto flex gap-3 text-xs font-medium">
              <span>{runtimeToHoursMins(movie.tmdb.runtime)}</span>
              <span>{movie.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {movie && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 self-end opacity-0 transition group-hover:opacity-100">
          {/* <LibraryButtonWatched movieId={movie.movieId} messageId={messageId} library={library} /> */}
          {/* <LibraryButtonLike movieId={movie.movieId} messageId={messageId} library={library} /> */}
          <LibraryButtonWatchlist movieId={movie.movieId} messageId={messageId} library={library} />
          <Button
            className={cn(library?.watchlist)}
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch({ type: 'OPEN_MOVIE_MODAL', payload: { movieId: movie.movieId } });
            }}
          >
            <PanelRight className="mr-1 -ml-1 size-4 shrink-0" strokeWidth={2} />
            Open
          </Button>
        </div>
      )}
    </div>
  );
};
