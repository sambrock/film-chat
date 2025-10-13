import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryGetChatMessages = (conversationId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.getChatMessages.queryOptions(conversationId, {}));
};
