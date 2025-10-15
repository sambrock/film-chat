import { queryOptions, useQuery } from '@tanstack/react-query';

import { getChat } from '~/server/functions/get-chat';

// import { useTRPC } from '~/lib/trpc/client';

export const queryGetChatOptions = (conversationId: string) =>
  queryOptions({
    queryKey: ['chat', conversationId],
    queryFn: async () => getChat({ data: { conversationId } }),
  });

export const useQueryGetChat = (conversationId: string) => {
  return useQuery(queryGetChatOptions(conversationId));
};
