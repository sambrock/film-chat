import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useMutationDeleteConversation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.deleteConversation.mutationOptions({
      onMutate: ({ conversationId }) => {
        queryClient.setQueryData(trpc.conversations.queryKey(undefined), (state) =>
          state?.filter((c) => c.conversationId !== conversationId)
        );
      },
    })
  );
};
