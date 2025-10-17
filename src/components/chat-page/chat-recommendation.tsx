import { Check, PanelRight, Plus } from 'lucide-react';

import type { Library, MessageAssistant, Movie, Recommendation } from '~/lib/definitions';
import { cn, genreName, runtimeToHoursMins, tmdbPosterSrc } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationUpdateLibrary } from '~/hooks/use-mutation-update-library';
import { MovieDetailsModal } from '../shared/movie-details-modal/movie-details-modal';
import { MovieDetailsModalContextProvider } from '../shared/movie-details-modal/movie-details-modal-context-provider';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { useChatContext } from './chat-context-provider';

type Props = { message: MessageAssistant; recommendation: Recommendation; movie?: Movie; library?: Library };

export const ChatRecommendation = ({ message, recommendation, movie, library }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  const handleOpen = () => {
    if (!movie || !recommendation.movieId) return;
    dispatch({
      type: 'OPEN_MODAL_MOVIE_DETAILS',
      payload: { movieId: recommendation.movieId },
    });
  };

  return (
    <div className="group border-foreground-0/5 relative flex px-2 py-2">
      <div
        className={cn(
          'bg-background-2/40 w-20 shrink-0 self-start overflow-clip rounded-sm md:aspect-[1/1.5] md:w-22',
          movie && 'shadow-md shadow-black/20'
        )}
      >
        {movie && (
          <img
            className="object-fit"
            src={tmdbPosterSrc(movie.tmdb.poster_path!, 'w185')}
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
        <div className="absolute right-2 bottom-2 flex items-center gap-1 self-end opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 focus:opacity-100">
          <ButtonAddToWatchlist
            messageId={message.messageId}
            movieId={movie.movieId}
            watchlist={library?.watchlist ?? false}
          />
          <Button size="sm" onClick={handleOpen} pill>
            <Icon icon={PanelRight} size="sm" className="mr-1" />
            Open
          </Button>
        </div>
      )}

      {movie && (
        <MovieDetailsModalContextProvider
          value={{
            page: 'chat',
            conversationId: message.conversationId,
            messageId: message.messageId,
            library,
          }}
        >
          <MovieDetailsModal movie={movie} />
        </MovieDetailsModalContextProvider>
      )}
    </div>
  );
};

const ButtonAddToWatchlist = ({
  messageId,
  movieId,
  watchlist,
}: {
  messageId: string;
  movieId: string;
  watchlist: boolean;
}) => {
  const { conversationId } = useChatContext();

  const updateLibraryMutation = useMutationUpdateLibrary();

  const handleAdd = () => {
    updateLibraryMutation.mutate({
      page: 'chat',
      conversationId,
      messageId,
      data: {
        movieId,
        watchlist: !watchlist,
      },
    });
  };

  return (
    <Button className={cn('justify-center transition-all')} size="sm" onClick={handleAdd} pill>
      {watchlist ? (
        <>
          <Icon icon={Check} size="sm" className="mr-1" />
          Added to watchlist
        </>
      ) : (
        <>
          <Icon icon={Plus} size="sm" className="mr-1" />
          Add to watchlist
        </>
      )}
    </Button>
  );
};
