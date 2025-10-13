import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryGetChat = (conversationId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.getChat.queryOptions(conversationId));
};
