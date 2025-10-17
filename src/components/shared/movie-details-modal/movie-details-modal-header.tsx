import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, ChevronsRight, ChevronUp, Plus } from 'lucide-react';

import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationUpdateLibrary } from '~/hooks/use-mutation-update-library';
import { queryGetChatMessagesOptions } from '~/hooks/use-query-get-chat-messages';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { ModalClose } from '~/components/ui/modal';
import { Header } from '../header';
import { useMovieDetailsModalContext } from './movie-details-modal-context-provider';

export const MovieDetailsModalHeader = () => {
  return (
    <Header className="sticky top-0 z-50">
      <ModalClose asChild>
        <Button size="icon">
          <Icon icon={ChevronsRight} />
        </Button>
      </ModalClose>

      <div className="ml-auto flex items-center gap-1">
        <ButtonPrevMovie />
        <ButtonNextMovie />
        <ButtonAddToWatchlist />
      </div>
    </Header>
  );
};

const ButtonPrevMovie = () => {
  const queryClient = useQueryClient();

  const modal = useGlobalStore((s) => s.modalMovieDetails!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const context = useMovieDetailsModalContext();

  const getPrevMovieId = () => {
    let movieIds: string[] = [];

    if (context.page === 'chat') {
      movieIds =
        queryClient
          .getQueryData(queryGetChatMessagesOptions(context.conversationId).queryKey)
          ?.filter((m) => m.role === 'assistant')
          .flatMap((m) => m.movies)
          .map((r) => r.movieId) || [];
    }
    if (context.page === 'library') {
      movieIds = [];
    }

    const currentIndex = movieIds.indexOf(modal.movieId);
    const nextIndex = (currentIndex + 1) % movieIds.length;

    return movieIds[nextIndex];
  };

  const handlePrev = () => {
    const prevMovieId = getPrevMovieId();
    if (!prevMovieId) return;
    dispatch({
      type: 'SET_MODAL_MOVIE_DETAILS_MOVIE_ID',
      payload: { ...modal, movieId: prevMovieId },
    });
  };

  return (
    <Button size="icon" onClick={handlePrev} disabled={!getPrevMovieId()}>
      <Icon icon={ChevronDown} className="mt-0.5" />
    </Button>
  );
};

const ButtonNextMovie = () => {
  const queryClient = useQueryClient();

  const modal = useGlobalStore((s) => s.modalMovieDetails!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const context = useMovieDetailsModalContext();

  const getNextMovieId = () => {
    let movieIds: string[] = [];

    if (context.page === 'chat') {
      movieIds =
        queryClient
          .getQueryData(queryGetChatMessagesOptions(context.conversationId).queryKey)
          ?.filter((m) => m.role === 'assistant')
          .flatMap((m) => m.movies)
          .map((r) => r.movieId) || [];
    }
    if (context.page === 'library') {
      movieIds = [];
    }

    const currentIndex = movieIds.indexOf(modal.movieId);
    const prevIndex = (currentIndex - 1 + movieIds.length) % movieIds.length;

    return movieIds[prevIndex];
  };

  const handleNext = () => {
    const nextMovieId = getNextMovieId();
    if (!nextMovieId) return;
    dispatch({
      type: 'SET_MODAL_MOVIE_DETAILS_MOVIE_ID',
      payload: { ...modal, movieId: nextMovieId },
    });
  };

  return (
    <Button size="icon" onClick={handleNext} disabled={!getNextMovieId()}>
      <Icon icon={ChevronUp} className="mb-0.5" />
    </Button>
  );
};

const ButtonAddToWatchlist = () => {
  const modal = useGlobalStore((s) => s.modalMovieDetails!);

  const context = useMovieDetailsModalContext();

  const updateLibraryMutation = useMutationUpdateLibrary();

  const handleAdd = () => {
    if (context.page === 'chat') {
      updateLibraryMutation.mutate({
        page: context.page,
        conversationId: context.conversationId,
        messageId: context.messageId,
        data: {
          movieId: modal.movieId,
          watchlist: !context.library?.watchlist,
        },
      });
    }
  };

  return (
    <Button className={cn('min-w-[180px] justify-center transition-all')} onClick={handleAdd} pill>
      {context.library?.watchlist ? (
        <>
          <Icon icon={Check} className="mr-1 -ml-1" />
          Added to watchlist
        </>
      ) : (
        <>
          <Icon icon={Plus} className="mr-1 -ml-1" />
          Add to watchlist
        </>
      )}
    </Button>
  );
};
