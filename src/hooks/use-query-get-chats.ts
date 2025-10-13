import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryGetChats = () => {
  const trpc = useTRPC();
  return useQuery(
    trpc.getChats.queryOptions(undefined, {
      staleTime: 60 * 1000 * 1, // 1 minute
    })
  );
};
