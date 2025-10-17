import { queryOptions, useQuery } from '@tanstack/react-query';

import { getMovie } from '~/server/functions/get-movie';

export const queryGetMovieOptions = (movieId: string) =>
  queryOptions({
    queryKey: ['movie', movieId],
    queryFn: () => getMovie({ data: { movieId } }),
    enabled: !!movieId,
  });

export const useQueryGetMovie = (movieId: string) => {
  return useQuery(queryGetMovieOptions(movieId));
};
