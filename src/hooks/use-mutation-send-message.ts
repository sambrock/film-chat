// import { useRouter } from 'next/navigation';
// import { useMutation as useMutationReactQuery } from '@tanstack/react-query';
// import { useMutation } from 'convex/react';

// import { generateUuid } from '@/lib/utils';
// import { useGlobalStore } from '@/providers/global-store-provider';
// import { useSessionContext } from '@/providers/session-context-provider';
// import { useThreadContext } from '@/providers/thread-context-provider';

// export const useMutationSendMessage = () => {
//   const { session } = useSessionContext();
//   const { threadId, getThreadIsPersisted, setThreadIsPersisted } = useThreadContext();

//   const model = useGlobalStore((s) => s.model);
//   const dispatch = useGlobalStore((s) => s.dispatch);

//   const router = useRouter();

//   const newChatMessage = useMutation(api.chat.newChatMessage).withOptimisticUpdate((localStore, args) => {
//     const localStateThreads = localStore.getQuery(api.threads.getBySession, { session });
//     const localStateMessages = localStore.getQuery(api.messages.getByThreadId, { threadId: args.threadId });

//     if (localStateThreads && Array.isArray(localStateThreads) && !args.threadIsPersisted) {
//       localStore.setQuery(api.threads.getBySession, { session }, [
//         { threadId: args.threadId, userId: '', title: 'New chat' } as Doc<'threads'>,
//         ...localStateThreads,
//       ]);
//     }
//     if (localStateMessages && Array.isArray(localStateMessages)) {
//       localStore.setQuery(api.messages.getByThreadId, { threadId: args.threadId }, [
//         ...localStateMessages,
//         args.userMessage as Doc<'messages'>,
//         args.assistantMessage as Doc<'messages'>,
//       ]);
//     }
//   });

//   return useMutationReactQuery({
//     mutationFn: async (content: string) => {
//       dispatch({
//         type: 'MESSAGE_PENDING',
//         payload: { threadId, isPersisted: getThreadIsPersisted() },
//       });

//       const messageUserId = generateUuid();
//       const messageAssistantId = generateUuid();

//       // Create assistant message with empty content
//       await newChatMessage({
//         threadId,
//         threadIsPersisted: getThreadIsPersisted(),
//         session,
//         userMessage: {
//           messageId: messageUserId,
//           threadId,
//           model,
//           content,
//           role: 'user',
//           status: 'pending',
//         },
//         assistantMessage: {
//           messageId: messageAssistantId,
//           threadId,
//           model,
//           content: '',
//           role: 'assistant',
//           status: 'pending',
//         },
//       });

//       if (!document.URL.includes(threadId)) {
//         router.push(`/chat/${threadId}`);
//         // window.history.pushState(null, '', `/chat/${threadId}`);
//       }

//       setThreadIsPersisted();

//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         body: JSON.stringify({
//           threadId,
//           messageId: messageAssistantId,
//           content,
//           model,
//         } as ChatBodySchema),
//       });

//       const reader = response.body?.getReader();

//       if (!reader) {
//         throw new Error();
//       }

//       const readChunks = async () => {
//         const { done, value } = await reader.read();
//         if (done) return;

//         const chunk = new TextDecoder().decode(value);

//         dispatch({
//           type: 'SET_MESSAGE_PENDING_CONTENT',
//           payload: { messageId: messageAssistantId, content: chunk, append: true },
//         });

//         await readChunks();
//       };

//       await readChunks();

//       dispatch({
//         type: 'MESSAGE_DONE',
//         payload: { threadId },
//       });
//     },
//   });
// };
