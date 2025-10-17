import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { updateLibrary, UpdateLibraryData } from '~/server/data/update-library';
import { queryGetChatMessagesOptions } from './use-query-get-chat-messages';

type MutationData =
  | { page: 'library'; data: UpdateLibraryData }
  | { page: 'chat'; conversationId: string; messageId: string; data: UpdateLibraryData };

export const useMutationUpdateLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: MutationData) => {
      return updateLibrary({ data });
    },
    onMutate: (variables) => {
      if (variables.page === 'chat') {
        const { conversationId, messageId, data } = variables;
        queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
          produce(state, (draft) => {
            if (!draft) draft = [];
            const messages = draft.filter((m) => m.role === 'assistant');
            const libraries = messages.flatMap((m) => m.libraries);
            const library = libraries.find((l) => l.movieId === data.movieId);
            if (library) {
              library.watched = data.watched ?? library.watched;
              library.watchlist = data.watchlist ?? library.watchlist;
              library.liked = data.liked ?? library.liked;
            } else {
              const message = draft.find((m) => m.messageId === messageId);
              if (message && message.role === 'assistant') {
                if (!message.libraries) message.libraries = [];
                message.libraries.push({
                  userId: '',
                  movieId: data.movieId,
                  watched: data.watched ?? false,
                  watchlist: data.watchlist ?? false,
                  liked: data.liked ?? false,
                  ignore: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
            }
          })
        );
      } else if (variables.page === 'library') {
        //
      }
    },
  });
};
