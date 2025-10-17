import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { produce } from 'immer';

import { deleteChat } from '~/server/functions/delete-chat';
import { queryGetChatsOptions } from './use-query-get-chats';

export const useMutationDeleteChat = () => {
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (conversationId: string) => {
      return deleteChat({ data: { conversationId } });
    },
    onMutate: (conversationId) => {
      queryClient.setQueryData(queryGetChatsOptions().queryKey, (state) =>
        produce(state, (draft) => {
          if (!draft) draft = [];
          return draft.filter((chat) => chat.conversationId !== conversationId);
        })
      );
      if (location.pathname === `/chat/${conversationId}`) {
        navigate({ to: '/' });
      }
    },
  });
};
