'use client';

import { PanelRight } from 'lucide-react';

import { Movie, Recommendation } from '@/lib/definitions';
import { cn, genreName, posterSrc, runtimeToHoursMins } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { Icon } from '../common/icon';

type Props = { recommendation: Recommendation; movie?: Movie };

export const ChatRecommendation = ({ recommendation, movie }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);

  const handleOpen = () => {
    if (!movie || !recommendation.movieId) return;
    dispatch({
      type: 'OPEN_MOVIE_MODAL',
      payload: { movieId: recommendation.movieId, source: 'recommendation' },
    });
  };

  return (
    <div className="group border-foreground-0/5 relative flex px-2 py-2">
      <div
        className={cn(
          'bg-background-4 w-20 shrink-0 self-start overflow-clip rounded-sm shadow-md shadow-black/20 md:aspect-[1/1.5] md:w-22'
        )}
      >
        {movie && (
          <img
            className="object-fit"
            src={posterSrc(movie.tmdb.poster_path!, 'w185')}
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
          {/* <ButtonAddToWatchlist movieId={recommendation.movie.movieId} /> */}
          <Button size="sm" onClick={handleOpen} pill>
            <Icon icon={PanelRight} size="sm" className="mr-1" />
            Open
          </Button>
        </div>
      )}

      {/* <ChatRecommendationMovieDetailsModal /> */}
    </div>
  );
};

// const ButtonAddToWatchlist = ({ movieId }: { movieId: string }) => {
//   const library = useLiveQuery(
//     (q) =>
//       q
//         .from({ library: libraryCollection })
//         .where(({ library }) => eq(library.movieId, movieId))
//         .findOne(),
//     [movieId]
//   );

//   const handleAdd = () => {
//     if (library.data) {
//       libraryCollection.update(movieId, (draft) => {
//         draft.watchlist = !draft.watchlist;
//       });
//     } else {
//       libraryCollection.insert({
//         movieId,
//         userId: '',
//         watchlist: true,
//         liked: false,
//         watched: false,
//         ignore: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }
//   };

//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const isHover = useHover(buttonRef as React.RefObject<HTMLElement>);

//   return (
//     <Button
//       ref={buttonRef}
//       className={cn('justify-center transition-all', library.data?.watchlist && isHover && 'text-red-400')}
//       size="sm"
//       onClick={handleAdd}
//       pill
//     >
//       {library.data?.watchlist ? (
//         <>
//           <Icon icon={Check} size="sm" className="mr-1" />
//           Added to watchlist
//         </>
//       ) : (
//         <>
//           <Icon icon={Plus} size="sm" className="mr-1" />
//           Add to watchlist
//         </>
//       )}
//     </Button>
//   );
// };
