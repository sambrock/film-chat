import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '~/lib/trpc/client';

export const useQueryGetMovie = (movieId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.getMovie.queryOptions(movieId));
};
