import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getLibrary } from '~/server/data/get-library';

export const queryGetLibraryOptions = () =>
  queryOptions({
    queryKey: ['library'],
    queryFn: () => getLibrary(),
  });

export const useQueryGetLibrary = () => {
  return useSuspenseQuery(queryGetLibraryOptions());
};
