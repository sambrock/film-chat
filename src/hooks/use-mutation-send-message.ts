import { useMutation } from '@tanstack/react-query';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import superjson from 'superjson';

import { ChatBody, ChatSSEData } from '@/app/api/chat/route';
import {
  chatsCollection,
  messagesCollection,
  moviesCollection,
  recommendationsCollection,
} from '@/lib/collections';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useChatContext } from '@/components/chat/chat-context';

export const useMutationSendMessage = () => {
  const { conversationId } = useChatContext();

  const model = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return useMutation({
    mutationFn: async (content: string) => {
      const hasChat = chatsCollection.has(conversationId);
      if (!hasChat) {
        chatsCollection.utils.writeInsert({
          conversationId,
          userId: '',
          title: 'New chat',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ conversationId, content, model } as ChatBody),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const eventStream = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream());

      const reader = eventStream.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const { event, data } = value;

          if (event === 'delta') {
            const parsed = superjson.parse<ChatSSEData>(data);

            if (parsed.type === 'conversation') {
              chatsCollection.utils.writeUpsert(parsed.v);
            }
            if (parsed.type === 'message') {
              messagesCollection.utils.writeUpsert(parsed.v);
            }
            if (parsed.type === 'recommendations') {
              recommendationsCollection.utils.writeBatch(() =>
                parsed.v.map((r) => recommendationsCollection.utils.writeInsert(r))
              );
            }
            if (parsed.type === 'movie') {
              moviesCollection.utils.writeUpsert(parsed.v);
            }
            if (parsed.type === 'content') {
              messagesCollection.utils.writeUpdate({
                messageId: parsed.id,
                content: (messagesCollection.get(parsed.id)?.content || '') + parsed.v,
              });
            }
          }
          if (event === 'end') {
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  });
};

// export const useMutationSendMessage = () => {
//   const { conversationId } = useChatContext();

//   const model = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
//   const dispatch = useGlobalStore((s) => s.dispatch);

//   const trpc = useTRPC();
//   const queryClient = useQueryClient();

//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (content: string) => {
//       const isNewConversation =
//         queryClient
//           .getQueryData(trpc.conversations.queryKey(undefined))
//           ?.some((c) => c.conversationId === conversationId) || true;

//       if (isNewConversation) {
//         // Update URL, but don't reload the page
//         window.history.replaceState({}, '', `/c/${conversationId}`);
//       }

//       dispatch({
//         type: 'SET_CONVERSATION_PROCESSING',
//         payload: { conversationId },
//       });

//       queryClient.setQueryData(trpc.conversations.queryKey(undefined), (state) =>
//         produce(state, (draft) => {
//           if (!draft) draft = [];
//           const index = draft.findIndex((c) => c.conversationId === conversationId);
//           if (index === -1) {
//             draft.unshift({
//               conversationId,
//               title: 'New chat',
//               userId: '',
//               createdAt: new Date(),
//               updatedAt: new Date(),
//             });
//           }
//         })
//       );

//       queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
//         produce(state, (draft) => {
//           if (!draft) draft = [];
//           draft.unshift({
//             messageId: `${randomUuid()}`,
//             conversationId,
//             model,
//             content,
//             role: 'user',
//             status: 'processing',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           });
//           draft.unshift({
//             messageId: `${randomUuid()}`,
//             parentId: `${randomUuid()}`,
//             conversationId,
//             model,
//             content,
//             role: 'assistant',
//             status: 'processing',
//             library: [],
//             movies: [],
//             recommendations: [],
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           });
//         })
//       );

//       const response = await fetch('/api/conversation', {
//         method: 'POST',
//         body: JSON.stringify({ conversationId, content, model } as ConversationBody),
//       });

//       if (!response.body) {
//         throw new Error('No response body');
//       }

//       const eventStream = response.body
//         .pipeThrough(new TextDecoderStream())
//         .pipeThrough(new EventSourceParserStream());

//       const reader = eventStream.getReader();

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         const { event, data } = value;

//         if (event === 'delta') {
//           const parsed = superjson.parse(data) as ChatSSEData;

//           if (parsed.type === 'conversation') {
//             queryClient.setQueryData(trpc.conversations.queryKey(undefined), (state) =>
//               produce(state, (draft) => {
//                 if (!draft) draft = [];
//                 const index = draft.findIndex((c) => c.conversationId === parsed.v.conversationId);
//                 if (index !== -1) {
//                   Object.assign(draft[index], parsed.v);
//                 } else {
//                   draft.unshift(parsed.v);
//                 }
//               })
//             );
//           }
//           if (parsed.type === 'message_processing') {
//             queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
//               produce(state, (draft) => {
//                 if (!draft) draft = [];
//                 if (parsed.v.role === 'user') {
//                   const index = draft.findIndex((m) => m.role === 'user' && m.status === 'processing');
//                   if (index !== -1) {
//                     draft[index] = parsed.v;
//                   }
//                 }
//                 if (parsed.v.role === 'assistant') {
//                   const index = draft.findIndex((m) => m.role === 'assistant' && m.status === 'processing');
//                   if (index !== -1) {
//                     draft[index] = parsed.v;
//                   }
//                 }
//               })
//             );
//           }
//           if (parsed.type === 'message_done') {
//             queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
//               produce(state, (draft) => {
//                 if (!draft) draft = [];
//                 if (parsed.v.role === 'user') {
//                   const index = draft.findIndex((m) => m.role === 'user' && m.status === 'processing');
//                   if (index !== -1) {
//                     draft[index] = parsed.v;
//                   }
//                 }
//                 if (parsed.v.role === 'assistant') {
//                   const index = draft.findIndex((m) => m.messageId === parsed.v.messageId);
//                   if (index !== -1) {
//                     draft[index] = parsed.v;
//                   }
//                 }
//               })
//             );
//           }
//           if (parsed.type === 'content') {
//             queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
//               produce(state, (draft) => {
//                 if (!draft) draft = [];
//                 const message = draft.find((m) => m.role === 'assistant' && m.status === 'processing');
//                 if (message && message.role === 'assistant') {
//                   message.content += parsed.v;
//                   message.recommendations = parseRecommendations(message.content, message.messageId);
//                 }
//               })
//             );
//           }
//         }
//         if (event === 'end') {
//           queryClient.invalidateQueries({
//             queryKey: [
//               trpc.conversationHistory.queryKey({ conversationId }),
//               trpc.conversations.queryKey(undefined),
//             ],
//           });

//           dispatch({
//             type: 'SET_CONVERSATION_DONE',
//             payload: { conversationId },
//           });

//           if (isNewConversation) {
//             router.push(`/c/${conversationId}`);
//           }
//         }
//       }
//     },
//   });
// };
