'use client';

import { posterSrc } from '@/lib/utils';
import { useQueryMovieDetails } from '@/hooks/use-query-movie-details';
import { Carousel, CarouselItem } from '../common/carousel';

type Props = { movieId: string };

export const MovieDetailsCrew = ({ movieId }: Props) => {
  const movieData = useQueryMovieDetails(movieId);

  if (movieData.isLoading || !movieData.data) {
    return <div>Loading...</div>;
  }

  return (
    movieData.data.credits.crew?.length && (
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {movieData.data.credits.crew
          ?.filter((crew) => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(crew.job!))
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
              <div className="text-foreground-1 mt-0.5 text-xs font-normal">{crew.jobs.join(', ')}</div>
            </div>
          ))}
      </div>
    )
  );
};

export const MovieDetailsCast = ({ movieId }: Props) => {
  const movieData = useQueryMovieDetails(movieId);

  if (movieData.isLoading || !movieData.data) {
    return <div>Loading...</div>;
  }

  return (
    movieData.data.credits.crew?.length && (
      <Carousel className="flex gap-2 overflow-x-auto">
        {movieData.data.credits.cast?.slice(0, 10).map((cast) => (
          <CarouselItem key={cast.cast_id} className="flex flex-col">
            <div className="bg-background-1 mb-1 aspect-square h-42 w-32 overflow-clip rounded-md">
              {cast.profile_path ? (
                <img
                  className="object-fit brightness-90"
                  src={posterSrc(cast.profile_path, 'w154')}
                  alt={cast.name}
                />
              ) : (
                <div className="bg-foreground-0/5 text-foreground-1 flex h-full w-full"></div>
              )}
            </div>
            <div className="mt-1 text-sm font-medium">
              <div className="w-32 font-medium">{cast.name}</div>
              <div className="text-foreground-1 mt-0.5 text-xs font-normal">{cast.character}</div>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    )
  );
};
