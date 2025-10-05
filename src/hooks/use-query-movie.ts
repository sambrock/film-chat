import { useQuery } from '@tanstack/react-query';

import type { Movie } from '@/lib/definitions';
import { useTRPC } from '@/lib/trpc/client';

export const useQueryMovie = (movieId: string, initialData: Movie) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.movie.queryOptions(
      { movieId },
      {
        enabled: !!movieId,
        initialData: {
          ...initialData,
          credits: { id: initialData.tmdbId, cast: [], crew: [] },
          libraries: [],
        },
        staleTime: 0,
      }
    )
  );
};
