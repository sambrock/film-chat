import { useQueryGetLibrary } from '~/hooks/use-query-get-library';
import { Header } from '../shared/header';
import { LibraryMovieItem } from './library-movie-item';

export const LibraryPage = () => {
  const libraryQuery = useQueryGetLibrary();

  return (
    <div>
      <Header>
        <Header.Title>Library</Header.Title>
      </Header>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 gap-y-2 py-8 md:grid-cols-4 lg:grid-cols-6">
        {libraryQuery.data?.map(({ movie, ...library }) => (
          <LibraryMovieItem key={movie.movieId} library={library} movie={movie} />
        ))}
      </div>
    </div>
  );
};
