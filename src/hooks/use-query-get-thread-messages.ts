import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryGetThreadMessages = (threadId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.getThreadMessages.queryOptions({ threadId }, { initialData: [] }));
};
