import { queryOptions, useQuery } from '@tanstack/react-query';

import { getChatMessages } from '~/routes/functions/get-chat-messages';

export const queryGetChatMessagesOptions = (conversationId: string) =>
  queryOptions({
    queryKey: ['chat-messages', conversationId],
    queryFn: () => getChatMessages({ data: { conversationId } }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

export const useQueryGetChatMessages = (conversationId: string) => {
  return useQuery(queryGetChatMessagesOptions(conversationId));
};
