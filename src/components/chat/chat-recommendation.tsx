'use client';

import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { useChatRecommendationContext } from './chat-context';
import { ChatMovieActionButtonAddToWatchlist, ChatMovieActionButtonOpen } from './chat-movie-actions';
import { ChatRecommendationMovieDetailsModal } from './chat-recommendation-movie-details-modal';

export const ChatRecommendation = () => {
  const { recommendation, movie } = useChatRecommendationContext();

  return (
    <div className="group border-foreground-0/5 relative flex px-2 py-2">
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
        <div className="mb-1 flex flex-wrap items-baseline font-semibold">
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
        <div className="absolute right-2 bottom-2 flex items-center gap-1 self-end opacity-0 transition group-hover:opacity-100">
          <ChatMovieActionButtonAddToWatchlist />
          <ChatMovieActionButtonOpen />
        </div>
      )}

      <ChatRecommendationMovieDetailsModal />
    </div>
  );
};
