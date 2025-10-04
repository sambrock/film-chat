import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryLibrary = () => {
  const trpc = useTRPC();

  return useQuery(trpc.library.queryOptions(undefined, {}));
};
