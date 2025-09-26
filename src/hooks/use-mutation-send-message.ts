import { useRouter } from 'next/navigation';
import { useMutation as useMutationReactQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { ChatBodySchema, ChatSSE } from '@/app/api/chat/route';
import { useTRPC } from '@/lib/trpc/client';
import { modelResponseTextToMovies } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useThreadContext } from '@/providers/thread-context-provider';

export const useMutationSendMessage = () => {
  const { threadId } = useThreadContext();

  const model = useGlobalStore((s) => s.model);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutationReactQuery({
    mutationFn: async (content: string) => {
      // dispatch({
      //   type: 'MESSAGE_PENDING',
      //   payload: { threadId },
      // });

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ threadId, content, model } as ChatBodySchema),
      });

      const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const data = value
          .split('\n')
          .filter((line) => line.startsWith('data: '))
          .map((line) => line.replace('data: ', '').trim())
          .filter((line) => line !== '[DONE]');

        for (const item of data) {
          const parsed = JSON.parse(item) as ChatSSE;

          if (parsed.type === 'thread') {
            // router.replace(`/chat/${parsed.threadId}`);
          }
          if (parsed.type === 'message') {
            queryClient.setQueryData(
              trpc.getThreadMessages.queryKey({ threadId: parsed.threadId }),
              (state) => {
                return produce(state, (draft) => {
                  if (!draft) return;
                  draft.unshift(parsed.message);
                });
              }
            );
          }
          if (parsed.type === 'content') {
            queryClient.setQueryData(
              trpc.getThreadMessages.queryKey({ threadId: parsed.threadId }),
              (state) => {
                return produce(state, (draft) => {
                  const message = draft?.find((m) => m.messageId === parsed.messageId);
                  if (message && message.role === 'assistant') {
                    message.content += parsed.v;
                  }
                });
              }
            );
          }
        }
      }

      if (!reader) {
        throw new Error();
      }

      //  router.push(`/chat/${threadId}`);

      // const readChunks = async () => {
      //   try {
      //     const { done, value } = await reader.read();
      //     if (done) return;

      //     const chunk = new TextDecoder().decode(value);

      //     const data = chunk
      //       .split('\n')
      //       .filter((line) => line.startsWith('data: '))
      //       .map((line) => line.replace('data: ', '').trim());

      //     const parsed = JSON.parse(data);

      //     console.log(parsed);
      //   } catch (e) {
      //     console.log('READ CHUNKS ERROR', e);
      //   }

      //   // dispatch({
      //   //   type: 'SET_MESSAGE_PENDING_CONTENT',
      //   //   payload: { messageId: messageAssistantId, content: chunk, append: true },
      //   // });

      //   await readChunks();
      // };

      // await readChunks();

      // dispatch({
      //   type: 'MESSAGE_DONE',
      //   payload: { threadId },
      // });
    },
  });
};
