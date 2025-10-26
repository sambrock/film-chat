import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getChats } from '~/server/data/get-chats';

export const queryGetChatsOptions = () =>
  queryOptions({
    queryKey: ['chats'],
    queryFn: () => getChats(),
  });

export const useQueryGetChats = () => {
  return useSuspenseQuery(queryGetChatsOptions());
};

export const useQueryGetChatsUtils = () => {
  const { data } = useQueryGetChats();

  const getChat = (conversationId: string) => {
    return data?.find((c) => c.conversationId === conversationId) || null;
  };

  const isNewChat = (conversationId: string) => {
    return data?.some((c) => c.conversationId === conversationId) === false || false;
  };

  return { getChat, isNewChat };
};
