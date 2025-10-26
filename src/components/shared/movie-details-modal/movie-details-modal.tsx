import { Movie } from '~/lib/definitions';
import { genreName, runtimeToHoursMins, tmdbBackdropSrc, tmdbPosterSrc } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { Modal, ModalContentDrawer, ModalDescription, ModalTitle } from '~/components/ui/modal';
import { MovieDetailsModalCast, MovieDetailsModalCrew } from './movie-details-modal-credits';
import { MovieDetailsModalHeader } from './movie-details-modal-header';

type Props = {
  movie: Movie;
};

export const MovieDetailsModal = ({ movie }: Props) => {
  const modal = useGlobalStore((s) => s.modalMovieDetails);
  const dispatch = useGlobalStore((s) => s.dispatch);

  if (!modal || modal.movieId !== movie.movieId) {
    return null;
  }
  return (
    <Modal
      open={modal.isOpen}
      onOpenChange={(open) => !open && dispatch({ type: 'CLOSE_MODAL_MOVIE_DETAILS', payload: undefined })}
    >
      <ModalContentDrawer shouldAnimate={modal.shouldAnimate}>
        <ModalTitle className="sr-only">{movie.tmdb.title}</ModalTitle>
        <ModalDescription className="sr-only">{movie.tmdb.overview}</ModalDescription>

        <MovieDetailsModalHeader />

        <div className="-mt-12 mb-12 flex flex-col">
          <div className="bg-sidebar relative h-[55vw] overflow-clip md:h-[430px]">
            <img
              className="h-full w-full object-cover"
              src={tmdbBackdropSrc(movie.tmdb.backdrop_path!, 'w1280')}
            />
            <div className="to-sidebar absolute inset-0 z-10 bg-gradient-to-b from-transparent" />
          </div>

          <div className="relative z-10 -mt-12 grid grid-cols-1 gap-x-4 px-3 sm:-mt-58 sm:grid-cols-[1fr_120px] sm:px-6 md:grid-cols-[1fr_160px] md:px-10">
            <div className="flex flex-col gap-2">
              <h1 className="mt-auto text-4xl font-black">
                {movie.tmdb.title}{' '}
                <span className="text-secondary-foreground ml-2 text-sm font-medium">
                  {new Date(movie.tmdb.release_date!).getFullYear()}
                </span>
              </h1>
              <div className="text-secondary-foreground flex gap-3 text-xs font-medium">
                <span>{runtimeToHoursMins(movie.tmdb.runtime)}</span>
                <span>{movie.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
              </div>
            </div>
            <div className="bg-background hidden aspect-[1/1.5] overflow-clip rounded-md border sm:flex">
              <img
                className="h-full w-full object-cover"
                src={tmdbPosterSrc(movie.tmdb.poster_path!, 'w185')}
              />
            </div>

            <div className="col-span-2 mt-6">
              <div className="text-foreground/80 mr-8 text-sm leading-6">
                {movie.tmdb.tagline && (
                  <span className="text-foreground/80 mr-2 mb-2 text-sm leading-6 font-medium italic">
                    {movie.tmdb.tagline}
                  </span>
                )}
                {movie.tmdb.overview}
              </div>

              <h2 className="text-secondary-foreground mt-12 mb-4 text-sm font-medium">Crew</h2>
              <MovieDetailsModalCrew movieId={modal.movieId} />

              <h2 className="text-secondary-foreground mt-6 mb-4 text-sm font-medium">Cast</h2>
              <MovieDetailsModalCast movieId={modal.movieId} />
            </div>
          </div>
        </div>
      </ModalContentDrawer>
    </Modal>
  );
};
