import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { renameChat, RenameChatData } from '~/server/data/rename-chat';
import { queryGetChatsOptions } from './use-query-get-chats';

export const useMutationRenameChat = () => {
  const queryClient = useQueryClient();
  const { optimisticRenameChat } = useMutationRenameChatUtils();

  return useMutation({
    mutationFn: (data: RenameChatData) => {
      return renameChat({ data });
    },
    onMutate: (data) => {
      optimisticRenameChat(data.conversationId, data.title);
      // queryClient.invalidateQueries(queryGetChatsOptions());
    },
  });
};

export const useMutationRenameChatUtils = () => {
  const queryClient = useQueryClient();

  const optimisticRenameChat = (conversationId: string, title: string) => {
    queryClient.setQueryData(queryGetChatsOptions().queryKey, (state) =>
      produce(state, (draft) => {
        if (!draft) return;
        const chat = draft.find((chat) => chat.conversationId === conversationId);
        if (chat) {
          chat.title = title;
        }
      })
    );
  };

  return {
    optimisticRenameChat,
  };
};
