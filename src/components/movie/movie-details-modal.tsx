'use client';

import { Movie } from '@/lib/definitions';
import { backdropSrc, cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useQueryMovie } from '@/hooks/use-query-movie';
import { Carousel, CarouselItem } from '../common/carousel';
import { Modal, ModalContentDrawer, ModalDescription, ModalTitle } from '../common/modal';
import { MovieDetailsContext } from './movie-details-context';

type Props = {
  isOpen: boolean;
  movieId: string;
  initialData: Movie;
  headerComponent?: React.ReactNode;
};

export const MovieDetailsModal = ({ isOpen, movieId, initialData, headerComponent }: Props) => {
  const shouldAnimate = useGlobalStore((s) => s.modalOpenShouldAnimate);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const { data } = useQueryMovie(movieId, initialData);

  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <MovieDetailsContext value={{ movie: data }}>
      <Modal
        open={isOpen}
        onOpenChange={(open) => !open && dispatch({ type: 'CLOSE_MOVIE_MODAL', payload: undefined })}
      >
        <ModalContentDrawer shouldAnimate={shouldAnimate}>
          <ModalTitle className="sr-only"></ModalTitle>
          <ModalDescription className="sr-only"></ModalDescription>

          {headerComponent}

          <div className="mb-12 flex flex-col -mt-12">
            <div className="relative">
              <img className="" src={backdropSrc(data.tmdb.backdrop_path!, 'w1280')} />
              <div className="to-background-0 absolute inset-0 z-10 bg-gradient-to-b from-transparent" />
            </div>

            <div className="relative z-10 -mt-58 grid grid-cols-[1fr_160px] gap-x-4 px-10">
              <div className="flex flex-col gap-2">
                <h1 className="mt-auto text-4xl font-black">
                  {data.tmdb.title}{' '}
                  <span className="text-foreground-1 ml-2 text-sm font-medium">
                    {new Date(data.tmdb.release_date!).getFullYear()}
                  </span>
                </h1>
                <div className="text-foreground-1 flex gap-3 text-xs font-medium">
                  <span>{runtimeToHoursMins(data.tmdb.runtime)}</span>
                  <span>{data.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
                </div>
              </div>
              <div className="overflow-clip rounded-md">
                <img src={posterSrc(data.tmdb.poster_path!, 'w185')} />
              </div>

              <div className="col-span-2 mt-6">
                <div className="text-foreground-0/80 mr-8 text-sm leading-6">
                  {data.tmdb.tagline && (
                    <span className="text-foreground-0/80 mr-2 mb-2 text-sm leading-6 font-medium italic">
                      {data.tmdb.tagline}
                    </span>
                  )}
                  {data.tmdb.overview}
                </div>

                <div className="text-foreground-2 mt-12">
                  <h2 className="text-foreground-2 mb-4 text-sm font-medium">Crew</h2>

                  {data?.credits?.crew?.length && (
                    <div className="no-scrollbar flex gap-3 overflow-x-auto">
                      {data.credits?.crew
                        ?.filter((crew) =>
                          ['Director', 'Producer', 'Screenplay', 'Writer'].includes(crew.job!)
                        )
                        .sort((a, b) => {
                          const order = ['Director', 'Producer', 'Writer', 'Screenplay'];
                          return order.indexOf(a.job!) - order.indexOf(b.job!);
                        })
                        .slice(0, 10)
                        .reduce(
                          (acc, crew) => {
                            const existing = acc.find((item) => item.name === crew.name);
                            if (existing) {
                              existing.jobs.push(crew.job!);
                            } else {
                              acc.push({ id: crew.id, name: crew.name!, jobs: [crew.job!] });
                            }
                            return acc;
                          },
                          [] as { id: number; name: string; jobs: string[] }[]
                        )
                        .map((crew) => (
                          <div key={crew.id} className="flex w-32 flex-col">
                            <div className="mt-1 text-sm font-medium">
                              <div className="text-foreground-0 w-32 font-medium" title={crew.name}>
                                {crew.name}
                              </div>
                            </div>
                            <div className="text-foreground-1 mt-1 text-xs font-normal">
                              {crew.jobs.join(', ')}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-foreground-2 mb-4 text-sm font-medium">Cast</h2>

                  <Carousel className="flex gap-2 overflow-x-auto">
                    {data.credits?.cast?.slice(0, 10).map((cast) => (
                      <CarouselItem key={cast.cast_id} className="flex flex-col">
                        <div className="bg-background-1 mb-1 aspect-square h-42 w-32 overflow-clip rounded-sm">
                          {cast.profile_path ? (
                            <img
                              className="object-fit brightness-90"
                              src={posterSrc(cast.profile_path, 'w154')}
                              alt={cast.name}
                            />
                          ) : (
                            <div className="bg-foreground-0/5 text-foreground-1 flex h-full w-full">
                              {/* <span className="text-xs">No Image</span> */}
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          <div className="w-32 font-medium">{cast.name}</div>
                          <div className="text-foreground-1 mt-1 text-xs font-normal">{cast.character}</div>
                        </div>
                      </CarouselItem>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </ModalContentDrawer>
      </Modal>
    </MovieDetailsContext>
  );
};
