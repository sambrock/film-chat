import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryLibraryCount = () => {
  const trpc = useTRPC();

  return useQuery(trpc.libraryCount.queryOptions(undefined, {}));
};
