import { useLocation } from '@tanstack/react-router';
import { ChevronDown, ChevronsRight, ChevronUp } from 'lucide-react';

import { useGlobalStore } from '~/stores/global-store-provider';
import { useDerivedChatMessagesMovies } from '~/hooks/use-query-get-chat-messages';
import { useDerivedLibraryMovies } from '~/hooks/use-query-get-library';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { ModalClose } from '~/components/ui/modal';
import { TooltipProvider } from '~/components/ui/tooltip';
import { Header } from '../header';
import { LibraryButtonLike } from '../library-buttons/library-button-like';
import { LibraryButtonWatch } from '../library-buttons/library-button-watch';
import { LibraryButtonWatchlist } from '../library-buttons/library-button-watchlist';
import { useMovieDetailsModalContext } from './movie-details-modal-context-provider';

export const MovieDetailsModalHeader = () => {
  const modal = useGlobalStore((s) => s.modalMovieDetails!);

  const { library } = useMovieDetailsModalContext();

  return (
    <Header className="!bg-background-0/5 z-50 !backdrop-blur-none">
      <ModalClose asChild>
        <Button size="icon">
          <Icon icon={ChevronsRight} />
        </Button>
      </ModalClose>
      <div className="flex gap-1">
        <ButtonPrevMovie />
        <ButtonNextMovie />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <TooltipProvider>
          <LibraryButtonWatchlist movieId={modal.movieId} library={library} />
          <LibraryButtonLike movieId={modal.movieId} library={library} />
          <LibraryButtonWatch movieId={modal.movieId} library={library} />
        </TooltipProvider>
      </div>
    </Header>
  );
};

const ButtonPrevMovie = () => {
  const modal = useGlobalStore((s) => s.modalMovieDetails!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const location = useLocation();

  const chatMovies = useDerivedChatMessagesMovies(
    location.pathname.startsWith('/chat') ? location.pathname.split('/chat/')[1] : undefined
  );
  const libraryMovies = useDerivedLibraryMovies();

  const getPrevMovieId = () => {
    const movieIds = location.pathname.startsWith('/chat')
      ? chatMovies.getMovies()
      : location.pathname.startsWith('/library')
        ? libraryMovies.getMovies()
        : [];

    const currentIndex = movieIds.indexOf(modal.movieId);
    if (currentIndex === -1) {
      return undefined;
    }
    const prevIndex = (currentIndex - 1 + movieIds.length) % movieIds.length;
    return movieIds[prevIndex];
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
  const modal = useGlobalStore((s) => s.modalMovieDetails!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const location = useLocation();

  const chatMovies = useDerivedChatMessagesMovies(
    location.pathname.startsWith('/chat') ? location.pathname.split('/chat/')[1] : undefined
  );
  const libraryMovies = useDerivedLibraryMovies();

  const getNextMovieId = () => {
    const movieIds = location.pathname.startsWith('/chat')
      ? chatMovies.getMovies()
      : location.pathname.startsWith('/library')
        ? libraryMovies.getMovies()
        : [];

    const currentIndex = movieIds.indexOf(modal.movieId);
    if (currentIndex === -1) {
      return undefined;
    }
    const nextIndex = (currentIndex + 1) % movieIds.length;
    return movieIds[nextIndex];
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
