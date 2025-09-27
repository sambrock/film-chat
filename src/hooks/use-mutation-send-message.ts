import { useMutation as useMutationReactQuery, useQueryClient } from '@tanstack/react-query';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import { produce } from 'immer';

import type { ChatSSEData, ConversationBody } from '@/app/api/conversation/route';
import { useTRPC } from '@/lib/trpc/client';
import { useConversationContext } from '@/providers/conversation-context-provider';
import { useGlobalStore } from '@/providers/global-store-provider';

export const useMutationSendMessage = () => {
  const { conversationId, setConversationId } = useConversationContext();

  const model = useGlobalStore((s) => s.model);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateConversationHistoryCache = <T>(draft: T) =>
    queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
      produce(state, (draft: T) => (draft = draft))
    );
    

  return useMutationReactQuery({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        body: JSON.stringify({ conversationId, content, model } as ConversationBody),
      });

      const stream = response.body!;

      const eventStream = stream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream());

      const reader = eventStream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const { event, data } = value;

        if (event === 'delta') {
          const parsed = JSON.parse(data) as ChatSSEData;
          if (parsed.type === 'conversation') {
          }
        }
      }
    },
  });
};

// while (true) {
//   const { value, done } = await reader.read();
//   if (done) break;

//   const data = value
//     .split('\n')
//     .filter((line) => line.startsWith('data: '))
//     .map((line) => line.replace('data: ', '').trim())
//     .filter((line) => line !== '[DONE]');

//   for (const item of data) {
//     const parsed = JSON.parse(item) as ChatSSE;

//     if (parsed.type === 'thread') {
//       if (threadId !== parsed.v) {
//         setThreadId(parsed.v);
//         window.history.replaceState(null, '', `/chat/${parsed.v}`);
//       }
//     }
//     if (parsed.type === 'message') {
//       queryClient.setQueryData(
//         trpc.conversationHistory.queryKey({ threadId: parsed.v.threadId }),
//         (state) => {
//           return produce(state, (draft) => {
//             console.log(parsed.v.role, draft);
//             if (!draft) draft = [];
//             const index = draft.findIndex((m) => m.messageId === parsed.v.messageId);
//             if (index !== -1) {
//               draft[index] = parsed.v;
//             } else {
//               draft.unshift(parsed.v);
//             }
//           });
//         }
//       );
//     }
//     if (parsed.type === 'end') {
//       queryClient.invalidateQueries({
//         queryKey: trpc.conversationHistory.queryKey({ threadId }),
//       });
//     }
//   }
// }

// dispatch({
//   type: 'MESSAGE_DONE',
//   payload: { threadId },
// });
