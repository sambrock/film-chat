import type { Movie } from '~/lib/definitions';
import { tmdbPosterSrc } from '~/lib/utils';

type Props = {
  movie: Movie;
};

export const LibraryMovieItem = ({ movie }: Props) => {
  return (
    <div>
      <div>
        <img src={tmdbPosterSrc(movie.tmdb.poster_path!, 'w185')} />
      </div>
      <div>{movie.tmdb.title}</div>
    </div>
  );
};
