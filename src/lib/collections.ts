// 'use client';

// import { queryCollectionOptions } from '@tanstack/query-db-collection';
// import { createCollection } from '@tanstack/react-db';

// import { queryClient } from '~/providers/query-client-trpc-provider';
// import { Library } from './definitions';
// import { trpc, trpcClient } from './trpc/client';

// export const chatsCollection = createCollection(
//   queryCollectionOptions({
//     queryClient,
//     queryKey: ['chats-collection'],
//     staleTime: 60 * 1000 * 5, // 5 minutes
//     startSync: true,
//     queryFn: async () => {
//       const data = queryClient.getQueryData(
//         trpc.getChats.queryKey({ userId: 'gVVxQZzL2YQccyDd9E39ehIoB2LPWwlK' })
//       );

//       return data ?? [];
//     },
//     getKey: (item) => item.conversationId,
//     onDelete: async ({ transaction }) => {
//       await trpcClient.saveTransaction.mutate(
//         transaction.mutations.map((data) => ({
//           type: 'delete',
//           schema: 'chat',
//           key: data.key,
//         }))
//       );
//     },
//   })
// );

// export const messagesCollection = createCollection(
//   queryCollectionOptions({
//     queryClient,
//     queryKey: trpc.syncMessages.queryKey(),
//     staleTime: 60 * 1000 * 5,
//     startSync: true,
//     queryFn: () => trpcClient.syncMessages.query(),
//     getKey: (item) => item.messageId,
//   })
// );

// export const recommendationsCollection = createCollection(
//   queryCollectionOptions({
//     queryClient,
//     queryKey: trpc.syncRecommendations.queryKey(),
//     staleTime: 60 * 1000 * 5,
//     startSync: true,
//     queryFn: () => trpcClient.syncRecommendations.query(),
//     getKey: (item) => item.recommendationId,
//   })
// );

// export const moviesCollection = createCollection(
//   queryCollectionOptions({
//     queryClient,
//     queryKey: trpc.syncMovies.queryKey(),
//     staleTime: 60 * 1000 * 5,
//     startSync: true,
//     queryFn: () => trpcClient.syncMovies.query(),
//     getKey: (item) => item.movieId,
//   })
// );

// export const libraryCollection = createCollection(
//   queryCollectionOptions({
//     queryClient,
//     queryKey: trpc.syncLibrary.queryKey(),
//     staleTime: 60 * 1000 * 5,
//     startSync: true,
//     queryFn: () => trpcClient.syncLibrary.query(),
//     getKey: (item) => item.movieId,
//     onInsert: async ({ transaction }) => {
//       await trpcClient.saveTransaction.mutate(
//         transaction.mutations.map((data) => ({
//           type: 'insert',
//           schema: 'library',
//           data: data.changes as Library,
//         }))
//       );
//     },
//     onUpdate: async ({ transaction }) => {
//       await trpcClient.saveTransaction.mutate(
//         transaction.mutations.map((data) => ({
//           type: 'update',
//           schema: 'library',
//           key: data.key,
//           data: data.changes,
//         }))
//       );
//     },
//   })
// );
