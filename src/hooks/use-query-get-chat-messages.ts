import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { getChatMessages } from '~/server/data/get-chat-messages';

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

export const useQueryGetChatMessagesUtils = () => {
  const queryClient = useQueryClient();

  const getChatMessagesMovies = (conversationId: string) => {
    const messages = queryClient.getQueryData(queryGetChatMessagesOptions(conversationId).queryKey) || [];

    const movieIds = messages
      .filter((m) => m.role === 'assistant')
      .flatMap((m) => m.movies)
      .map((r) => r.movieId);

    return [...new Set(movieIds)]; // return unique
  };

  return { getChatMessagesMovies };
};
