import { useIntersectionObserver } from 'usehooks-ts';

import { useQueryGetLibrary } from '~/hooks/use-query-get-library';
import { Header } from '../shared/header';
import { LibraryMovieItem, LibraryMovieItemSkeleton } from './library-movie-item';

export const LibraryPage = () => {
  const libraryQuery = useQueryGetLibrary();

  const { ref } = useIntersectionObserver({
    threshold: 1,
    onChange: (isIntersecting) => {
      if (isIntersecting && libraryQuery.hasNextPage && !libraryQuery.isFetchingNextPage) {
        libraryQuery.fetchNextPage();
      }
    },
  });

  return (
    <div className="pb-20">
      <Header>
        <Header.Title>Library</Header.Title>
      </Header>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 gap-y-2 py-8 md:grid-cols-4 lg:grid-cols-6">
        {libraryQuery.data?.pages.map((page) =>
          page.results.map(({ movie, ...library }) => (
            <LibraryMovieItem key={movie.movieId} library={library} movie={movie} />
          ))
        )}
        {libraryQuery.isFetchingNextPage && <LibraryPageSkeleton length={6} />}
      </div>
      <div ref={ref} style={{ height: 1 }} />
    </div>
  );
};

const LibraryPageSkeleton = ({ length }: { length: number }) => {
  return Array.from({ length }).map((_, index) => <LibraryMovieItemSkeleton key={index} />);
};
