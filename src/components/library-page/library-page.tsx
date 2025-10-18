import { useQueryGetLibrary } from '~/hooks/use-query-get-library';
import { Header } from '../shared/header';
import { LibraryMovieItem } from './library-movie-item';

export const LibraryPage = () => {
  const libraryQuery = useQueryGetLibrary();

  return (
    <div className="">
      <Header>
        <Header.Title>Library</Header.Title>
      </Header>

      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-6">
        {libraryQuery.data?.map((item) => (
          <LibraryMovieItem key={item.movieId} movie={item.movie} />
        ))}
      </div>
    </div>
  );
};
