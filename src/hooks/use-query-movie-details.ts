import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryMovieDetails = (movieId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.movieDetails.queryOptions(movieId));
};
