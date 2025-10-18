import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getLibraryCount } from '~/server/data/get-library-count';

export const queryGetLibraryCountOptions = () =>
  queryOptions({
    queryKey: ['library', 'count'],
    queryFn: () => getLibraryCount(),
  });

export const useQueryGetLibraryCount = () => {
  return useSuspenseQuery(queryGetLibraryCountOptions());
};
