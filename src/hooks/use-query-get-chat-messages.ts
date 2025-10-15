import { queryOptions, useQuery } from '@tanstack/react-query';

import { getChatMessages } from '~/server/functions/get-chat-messages';

export const queryGetChatMessagesOptions = (conversationId: string) =>
  queryOptions({
    queryKey: ['chat-messages', conversationId],
    queryFn: () => getChatMessages({ data: { conversationId } }),
  });

export const useQueryGetChatMessages = (conversationId: string) => {
  return useQuery(queryGetChatMessagesOptions(conversationId));
};
