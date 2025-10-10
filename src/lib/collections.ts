'use client';

import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';

import { queryClient } from '@/providers/query-client-trpc-provider';
import { trpc, trpcClient } from './trpc/client';

export const chatsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: trpc.syncChats.queryKey(),
    queryFn: () => trpcClient.syncChats.query(),
    getKey: (item) => item.conversationId,
  })
);

export const messagesCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: trpc.syncMessages.queryKey(),
    queryFn: () => trpcClient.syncMessages.query(),
    getKey: (item) => item.messageId,
  })
);

export const recommendationsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: trpc.syncRecommendations.queryKey(),
    queryFn: () => trpcClient.syncRecommendations.query(),
    getKey: (item) => item.recommendationId,
  })
);

export const moviesCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: trpc.syncMovies.queryKey(),
    queryFn: () => trpcClient.syncMovies.query(),
    getKey: (item) => item.movieId,
  })
);

export const libraryCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: trpc.syncLibrary.queryKey(),
    queryFn: () => trpcClient.syncLibrary.query(),
    getKey: (item) => item.movieId,
  })
);
