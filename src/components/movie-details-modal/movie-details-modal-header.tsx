'use client';

import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, ChevronsRight, ChevronUp, Plus } from 'lucide-react';
import { useHover } from 'usehooks-ts';

import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { queryGetChatMessagesOptions } from '~/hooks/use-query-get-chat-messages';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { ModalClose } from '../ui/modal';
import { Header } from '../shared/header';

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
  const modal = useGlobalStore((s) => s.movieModal!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const queryClient = useQueryClient();

  const getPrevMovieId = () => {
    let movieIds: string[] = [];

    if (modal.source === 'recommendation') {
      movieIds =
        queryClient
          .getQueryData(queryGetChatMessagesOptions(modal.conversationId!).queryKey)
          ?.filter((m) => m.role === 'assistant')
          .flatMap((m) => m.movies)
          .map((r) => r.movieId) || [];
    } else if (modal.source === 'library') {
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
      type: 'SET_MOVIE_MODAL_MOVIE_ID',
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
  const modal = useGlobalStore((s) => s.movieModal!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const queryClient = useQueryClient();

  const getNextMovieId = () => {
    let movieIds: string[] = [];

    if (modal.source === 'recommendation') {
      movieIds =
        queryClient
          .getQueryData(queryGetChatMessagesOptions(modal.conversationId!).queryKey)
          ?.filter((m) => m.role === 'assistant')
          .flatMap((m) => m.movies)
          .map((r) => r.movieId) || [];
    }
    if (modal.source === 'library') {
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
      type: 'SET_MOVIE_MODAL_MOVIE_ID',
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
  const modal = useGlobalStore((s) => s.movieModal!);

  // const library = useLiveQuery(
  //   (q) =>
  //     q
  //       .from({ library: libraryCollection })
  //       .where(({ library }) => eq(library.movieId, modal.movieId!))
  //       .findOne(),
  //   [modal.movieId]
  // );

  // const handleAdd = () => {
  //   if (library.data) {
  //     libraryCollection.update(modal.movieId, (draft) => {
  //       draft.watchlist = !draft.watchlist;
  //     });
  //   } else {
  //     libraryCollection.insert({
  //       movieId: modal.movieId,
  //       userId: '',
  //       watchlist: true,
  //       liked: false,
  //       watched: false,
  //       ignore: false,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });
  //   }
  // };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(buttonRef as React.RefObject<HTMLElement>);

  return (
    <Button
      ref={buttonRef}
      className={cn(
        'min-w-[180px] justify-center transition-all'
        // library.data?.watchlist && isHover && 'text-red-400'
      )}
      // onClick={handleAdd}
      pill
    >
      {true ? (
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
