'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Movie } from '~/lib/definitions';
import { backdropSrc, genreName, posterSrc, runtimeToHoursMins } from '~/lib/utils';
import { useGlobalStore } from '~/providers/global-store-provider';
import { queryGetChatMessagesOptions } from '~/hooks/use-query-get-chat-messages';
import { Modal, ModalContentDrawer, ModalDescription, ModalTitle } from '../common/modal';
import { MovieDetailsCast, MovieDetailsCrew } from './movie-details-credits';
import { MovieDetailsModalHeader } from './movie-details-modal-header';

export const MovieDetailsModal = () => {
  const modal = useGlobalStore((s) => s.movieModal);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const queryClient = useQueryClient();

  if (!modal) {
    return null;
  }

  let movie: Movie | undefined;
  if (modal.source === 'recommendation') {
    movie = queryClient
      .getQueryData(queryGetChatMessagesOptions(modal.conversationId!).queryKey)
      ?.filter((m) => m.role === 'assistant')
      .flatMap((m) => m.movies)
      .find((m) => m.movieId === modal.movieId);
  } else if (modal.source === 'library') {
    movie = undefined;
  }

  if (!movie) {
    return null;
  }
  return (
    <Modal
      open={modal.isOpen}
      onOpenChange={(open) => !open && dispatch({ type: 'CLOSE_MOVIE_MODAL', payload: undefined })}
    >
      <ModalContentDrawer shouldAnimate={modal.shouldAnimate}>
        <ModalTitle className="sr-only">{movie.tmdb.title}</ModalTitle>
        <ModalDescription className="sr-only">{movie.tmdb.overview}</ModalDescription>

        <MovieDetailsModalHeader />

        <div className="-mt-12 mb-12 flex flex-col">
          <div className="bg-background-1 relative h-[430px] overflow-clip">
            <img className="" src={backdropSrc(movie.tmdb.backdrop_path!, 'w1280')} />
            <div className="to-background-0 absolute inset-0 z-10 bg-gradient-to-b from-transparent" />
          </div>

          <div className="relative z-10 -mt-58 grid grid-cols-[1fr_160px] gap-x-4 px-10">
            <div className="flex flex-col gap-2">
              <h1 className="mt-auto text-4xl font-black">
                {movie.tmdb.title}{' '}
                <span className="text-foreground-1 ml-2 text-sm font-medium">
                  {new Date(movie.tmdb.release_date!).getFullYear()}
                </span>
              </h1>
              <div className="text-foreground-1 flex gap-3 text-xs font-medium">
                <span>{runtimeToHoursMins(movie.tmdb.runtime)}</span>
                <span>{movie.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
              </div>
            </div>
            <div className="overflow-clip rounded-md">
              <img src={posterSrc(movie.tmdb.poster_path!, 'w185')} />
            </div>

            <div className="col-span-2 mt-6">
              <div className="text-foreground-0/80 mr-8 text-sm leading-6">
                {movie.tmdb.tagline && (
                  <span className="text-foreground-0/80 mr-2 mb-2 text-sm leading-6 font-medium italic">
                    {movie.tmdb.tagline}
                  </span>
                )}
                {movie.tmdb.overview}
              </div>

              <h2 className="text-foreground-1 mt-12 mb-4 text-sm font-medium">Crew</h2>
              <MovieDetailsCrew movieId={modal.movieId} />

              <h2 className="text-foreground-1 mt-6 mb-4 text-sm font-medium">Cast</h2>
              <MovieDetailsCast movieId={modal.movieId} />
            </div>
          </div>
        </div>
      </ModalContentDrawer>
    </Modal>
  );
};
