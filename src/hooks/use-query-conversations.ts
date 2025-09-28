import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryConversations = () => {
  const trpc = useTRPC();

  return useQuery(trpc.conversations.queryOptions(undefined, {}));
};
