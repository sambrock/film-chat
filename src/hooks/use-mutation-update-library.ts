import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { produce } from 'immer';

import { updateLibrary } from '~/server/data/update-library';
import { Library } from '~/lib/definitions';
import { queryGetChatMessagesOptions } from './use-query-get-chat-messages';
import { queryGetLibraryOptions } from './use-query-get-library';

export const useMutationUpdateLibrary = () => {
  const queryClient = useQueryClient();

  const location = useLocation();

  return useMutation({
    mutationFn: (library: Library) => {
      return updateLibrary({
        data: {
          movieId: library.movieId,
          liked: library.liked,
          watched: library.watched,
          watchlist: library.watchlist,
        },
      });
    },
    onMutate: (updatedLibrary) => {
      if (location.pathname.startsWith('/chat')) {
        const conversationId = location.pathname.split('/chat/')[1];
        queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
          produce(state, (draft) => {
            if (!draft) draft = [];
            const messages = draft.filter((m) => m.role === 'assistant');
            const libraries = messages.flatMap((m) => m.libraries);
            const hasMovie = libraries.find((l) => l.movieId === updatedLibrary.movieId);
            if (hasMovie) {
              for (const library of libraries) {
                if (library.movieId === updatedLibrary.movieId) {
                  library.watched = updatedLibrary.watched;
                  library.watchlist = updatedLibrary.watchlist;
                  library.liked = updatedLibrary.liked;
                }
              }
            } else {
              const messagesWithMovie = messages.filter((m) =>
                m.movies?.some((mv) => mv.movieId === updatedLibrary.movieId)
              );
              for (const message of messagesWithMovie) {
                message.libraries = message.libraries || [];
                message.libraries.push(updatedLibrary);
              }
            }
          })
        );
      }
      queryClient.setQueryData(queryGetLibraryOptions().queryKey, (state) =>
        produce(state, (draft) => {
          if (!draft) draft = { pages: [], pageParams: [] };
          for (const page of draft.pages) {
            const index = page.results.findIndex((l) => l.movieId === updatedLibrary.movieId);
            if (index !== -1) {
              page.results[index].watched = updatedLibrary.watched;
              page.results[index].watchlist = updatedLibrary.watchlist;
              page.results[index].liked = updatedLibrary.liked;
            }
          }
        })
      );
    },
    onSuccess: () => {
      // Only invalidate chat messages if we're on a chat page
      if (location.pathname.startsWith('/chat')) {
        queryClient.refetchQueries({ queryKey: queryGetLibraryOptions().queryKey });
      }
    },
  });
};
