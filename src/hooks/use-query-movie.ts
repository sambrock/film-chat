import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryMovie = (movieId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.movie.queryOptions({ movieId }, { enabled: !!movieId }));
};
