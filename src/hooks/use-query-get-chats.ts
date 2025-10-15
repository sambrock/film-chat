import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getChats } from '~/server/functions/get-chats';

export const queryGetChatsOptions = () =>
  queryOptions({
    queryKey: ['chats'],
    queryFn: () => getChats(),
  });

export const useQueryGetChats = () => {
  return useSuspenseQuery(queryGetChatsOptions());
};

export const useDerivedChatExists = (conversationId: string) => {
  const { data } = useQueryGetChats();
  return data?.some((c) => c.conversationId === conversationId) || false;
};
