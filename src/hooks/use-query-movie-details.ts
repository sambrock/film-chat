import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryMovieDetails = (movieId: number) => {
  const trpc = useTRPC();

  // return useQuery(trpc.query);
};
