import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { useTRPC } from '@/lib/trpc/client';

export const useMutationUpdateLibrary = (conversationId: string, messageId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.updateLibrary.mutationOptions({
      onMutate: async (variables) => {
        console.log('VARIABLES', variables);
        queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
          produce(state, (draft) => {
            const message = draft?.find((m) => m.messageId === messageId);
            if (message && message.role === 'assistant') {
              const library = message.library.find((l) => l.movieId === variables.movieId);
              if (library) {
                library.liked = variables.liked ?? library.liked;
                library.watchlist = variables.watchlist ?? library.watchlist;
                library.watched = variables.watched ?? library.watched;
              } else {
                message.library.push({
                  userId: '',
                  movieId: variables.movieId,
                  liked: variables.liked ?? false,
                  watchlist: variables.watchlist ?? false,
                  watched: variables.watched ?? false,
                  ignore: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
            }
          })
        );
      },
    })
  );
};
