import { useMutation } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useMutationUpdateLibrary = (
  onMutate?: (variables: {
    movieId: string;
    liked?: boolean | undefined;
    watched?: boolean | undefined;
    watchlist?: boolean | undefined;
  }) => void
) => {
  const trpc = useTRPC();

  return useMutation(trpc.updateLibrary.mutationOptions({ onMutate }));
};
