'use client';

import { eq, useLiveQuery } from '@tanstack/react-db';
import { PanelRight } from 'lucide-react';

import { moviesCollection } from '@/lib/collections';
import { Recommendation } from '@/lib/definitions';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { Icon } from '../common/icon';

type Props = { recommendation: Recommendation };

export const ChatRecommendation = ({ recommendation }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  const movieQuery = useLiveQuery((q) =>
    q
      .from({ movie: moviesCollection })
      .where(({ movie }) => eq(movie.movieId, recommendation.movieId))
      .findOne()
  );

  const handleOpen = () => {
    if (!movieQuery.data || !movieQuery.data.movieId) return;
    dispatch({
      type: 'OPEN_MOVIE_MODAL',
      payload: { movieId: movieQuery.data.movieId, source: 'recommendation' },
    });
  };

  return (
    <div className="group border-foreground-0/5 relative flex px-2 py-2">
      <div
        className={cn(
          'bg-background-4 w-20 shrink-0 self-start overflow-clip rounded-sm shadow-md shadow-black/20 md:aspect-[1/1.5] md:w-22'
        )}
      >
        {movieQuery.data && (
          <img
            className="object-fit"
            src={posterSrc(movieQuery.data.tmdb.poster_path!, 'w185')}
            alt={movieQuery.data.tmdb.title}
          />
        )}
      </div>

      <div className="ml-4 flex w-full flex-col py-2">
        <div className="mb-1 flex flex-wrap items-baseline font-semibold">
          <span className="mr-1 max-w-4/5"> {recommendation.title} </span>
          <span className="text-foreground-1 ml-1 text-xs font-medium">
            {recommendation.releaseYear ? recommendation.releaseYear : ''}
          </span>
        </div>
        <div className="text-foreground-1 text-sm md:max-w-3/4">{recommendation.why}</div>
        <div className="flex items-baseline md:mt-auto">
          {movieQuery.data && (
            <div className="text-foreground-1 mt-auto flex gap-3 text-xs font-medium">
              <span>{runtimeToHoursMins(movieQuery.data.tmdb.runtime)}</span>
              <span>{movieQuery.data.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {movieQuery.data && (
        <div className="absolute right-2 bottom-2 flex items-center gap-1 self-end opacity-0 transition group-hover:opacity-100">
          {/* <ChatMovieActionButtonAddToWatchlist movie /> */}
          <Button className={cn('!rounded-full')} size="sm" onClick={handleOpen}>
            <Icon icon={PanelRight} size="xs" className="mr-1 -ml-1" />
            Open
          </Button>
        </div>
      )}

      {/* <ChatRecommendationMovieDetailsModal /> */}
    </div>
  );
};
