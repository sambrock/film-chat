import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryConversationHistory = (conversationId: string) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.conversationHistory.queryOptions(
      { conversationId },
      {
        initialData: [],
        staleTime: Infinity,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    )
  );
};
