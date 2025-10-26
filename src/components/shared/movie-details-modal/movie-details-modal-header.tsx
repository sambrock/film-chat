import { useLocation } from '@tanstack/react-router';
import { ChevronDown, ChevronsRight, ChevronUp } from 'lucide-react';

import { useGlobalStore } from '~/stores/global-store-provider';
import { useQueryGetChatMessagesUtils } from '~/hooks/use-query-get-chat-messages';
import { useQueryGetLibraryUtils } from '~/hooks/use-query-get-library';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { ModalClose } from '~/components/ui/modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { Header } from '../header';
import { LibraryButtonLike } from '../library-buttons/library-button-like';
import { LibraryButtonWatch } from '../library-buttons/library-button-watch';
import { LibraryButtonWatchlist } from '../library-buttons/library-button-watchlist';
import { useMovieDetailsModalContext } from './movie-details-modal-context-provider';

export const MovieDetailsModalHeader = () => {
  const modal = useGlobalStore((s) => s.modalMovieDetails!);

  const { library } = useMovieDetailsModalContext();

  return (
    <Header className="z-50 border-b-0 bg-transparent !backdrop-blur-none">
      <ModalClose asChild>
        <Button size="icon">
          <Icon icon={ChevronsRight} />
        </Button>
      </ModalClose>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <ButtonPrevMovie />
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            Previous Movie
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ButtonNextMovie />
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            Next Movie
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="bg-background/10 ml-auto flex items-center gap-0.5 rounded-full p-1 shadow ring-1 ring-white/10 backdrop-blur-md">
        <TooltipProvider>
          <LibraryButtonWatchlist movieId={modal.movieId} library={library} />
          <LibraryButtonLike movieId={modal.movieId} library={library} />
          <LibraryButtonWatch movieId={modal.movieId} library={library} />
        </TooltipProvider>
      </div>
    </Header>
  );
};

const ButtonPrevMovie = ({ onClick, ...props }: React.ComponentProps<typeof Button>) => {
  const modal = useGlobalStore((s) => s.modalMovieDetails!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const location = useLocation();

  const { getChatMessagesMovies } = useQueryGetChatMessagesUtils();
  const { getLibraryMovies } = useQueryGetLibraryUtils();

  const getPrevMovieId = () => {
    const movieIds = location.pathname.startsWith('/chat')
      ? getChatMessagesMovies(location.pathname.split('/chat/')[1])
      : location.pathname.startsWith('/library')
        ? getLibraryMovies()
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
    <Button
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        handlePrev();
        onClick?.(e);
      }}
      disabled={!getPrevMovieId()}
      {...props}
    >
      <Icon icon={ChevronDown} className="mt-0.5" />
    </Button>
  );
};

const ButtonNextMovie = ({ onClick, ...props }: React.ComponentProps<typeof Button>) => {
  const modal = useGlobalStore((s) => s.modalMovieDetails!);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const location = useLocation();

  const { getChatMessagesMovies } = useQueryGetChatMessagesUtils();
  const { getLibraryMovies } = useQueryGetLibraryUtils();

  const getNextMovieId = () => {
    const movieIds = location.pathname.startsWith('/chat')
      ? getChatMessagesMovies(location.pathname.split('/chat/')[1])
      : location.pathname.startsWith('/library')
        ? getLibraryMovies()
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
    <Button
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        handleNext();
        onClick?.(e);
      }}
      disabled={!getNextMovieId()}
      {...props}
    >
      <Icon icon={ChevronUp} className="mb-0.5" />
    </Button>
  );
};
