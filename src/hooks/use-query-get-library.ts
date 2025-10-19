import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { getLibrary } from '~/server/data/get-library';

export const queryGetLibraryOptions = () =>
  queryOptions({
    queryKey: ['library'],
    queryFn: () => getLibrary(),
  });

export const useQueryGetLibrary = () => {
  return useQuery(queryGetLibraryOptions());
};

export const useDerivedLibraryMovies = () => {
  const queryClient = useQueryClient();

  const getMovies = () => {
    const movieIds =
      queryClient
        .getQueryData(queryGetLibraryOptions().queryKey)
        ?.flatMap((m) => m.movie)
        .map((r) => r.movieId) || [];

    return [...new Set(movieIds)]; // return unique
  };

  return { getMovies };
};
