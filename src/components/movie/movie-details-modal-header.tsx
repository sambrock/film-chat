'use client';

import { useRef } from 'react';
import { eq, useLiveQuery } from '@tanstack/react-db';
import { Check, ChevronDown, ChevronsRight, ChevronUp, Minus, Plus } from 'lucide-react';
import { useHover } from 'usehooks-ts';

import { libraryCollection, recommendationsCollection } from '@/lib/collections';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { Icon } from '../common/icon';
import { ModalClose } from '../common/modal';
import { Header } from '../layout/header';

type Props = {
  movieId: string;
};

export const MovieDetailsModalHeader = ({ movieId }: Props) => {
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

  const getPrevMovieId = () => {
    let movieIds: string[] = [];

    if (modal.source === 'recommendation') {
      movieIds = recommendationsCollection.map((r) => r.movieId).filter(Boolean) as string[];
    }
    if (modal.source === 'library') {
      movieIds = libraryCollection.map((r) => r.movieId).filter(Boolean) as string[];
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

  const getNextMovieId = () => {
    let movieIds: string[] = [];

    if (modal.source === 'recommendation') {
      movieIds = recommendationsCollection.map((r) => r.movieId).filter(Boolean) as string[];
    }
    if (modal.source === 'library') {
      movieIds = libraryCollection.map((r) => r.movieId).filter(Boolean) as string[];
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

  const library = useLiveQuery(
    (q) =>
      q
        .from({ library: libraryCollection })
        .where(({ library }) => eq(library.movieId, modal.movieId!))
        .findOne(),
    [modal.movieId]
  );

  const handleAdd = () => {
    if (library.data) {
      libraryCollection.update(modal.movieId, (draft) => {
        draft.watchlist = !draft.watchlist;
      });
    } else {
      libraryCollection.insert({
        movieId: modal.movieId,
        userId: '',
        watchlist: true,
        liked: false,
        watched: false,
        ignore: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(buttonRef as React.RefObject<HTMLElement>);

  return (
    <Button
      ref={buttonRef}
      className={cn(
        'min-w-[180px] justify-center transition-all',
        library.data?.watchlist && isHover && 'text-red-400'
      )}
      onClick={handleAdd}
      pill
    >
      {library.data?.watchlist ? (
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
