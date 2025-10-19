import {
  InfiniteQueryObserver,
  infiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getLibrary } from '~/server/data/get-library';

export const queryGetLibraryOptions = () =>
  infiniteQueryOptions({
    queryKey: ['library'],
    queryFn: ({ pageParam }) => getLibrary({ data: { cursor: pageParam } }),
    initialPageParam: new Date().getTime(),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const useQueryGetLibrary = () => {
  return useInfiniteQuery(queryGetLibraryOptions());
};

export const useQueryGetLibraryObserver = () => {
  const queryClient = useQueryClient();

  const observer = new InfiniteQueryObserver(queryClient, queryGetLibraryOptions());

  return { observer };
};

export const useDerivedLibraryMovies = () => {
  const queryClient = useQueryClient();

  const getMovies = () => {
    const movieIds =
      queryClient
        .getQueryData(queryGetLibraryOptions().queryKey)
        ?.pages.flatMap((page) => page.results)
        .flatMap((m) => m.movie)
        .map((r) => r.movieId) || [];

    return [...new Set(movieIds)]; // return unique
  };

  return { getMovies };
};
