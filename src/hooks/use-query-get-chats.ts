import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';

export const useQueryGetChats = () => {
  const trpc = useTRPC();
  return useQuery(trpc.getChats.queryOptions(''));
};

export const useDerivedChatExists = (conversationId: string) => {
  const { data } = useQueryGetChats();
  return data?.some((c) => c.conversationId === conversationId) || false;
};
