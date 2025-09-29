import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';
import { useGlobalStore } from '@/providers/global-store-provider';

export const useQueryConversationHistory = (conversationId: string) => {
  const trpc = useTRPC();

  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));

  return useQuery(
    trpc.conversationHistory.queryOptions(
      { conversationId },
      {
        enabled: !!conversationId && !isProcessing,
        // initialData: [],
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    )
  );
};
