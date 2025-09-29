import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryConversation = (conversationId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.conversation.queryOptions({ conversationId }, {}));
};
