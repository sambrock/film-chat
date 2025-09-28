import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import { produce } from 'immer';

import type { ChatSSEData, ConversationBody } from '@/app/api/conversation/route';
import { useTRPC } from '@/lib/trpc/client';
import { parseRecommendations } from '@/lib/utils';
import { randomUuid } from '@/lib/utils/uuid';
import { useConversationContext } from '@/providers/conversation-context-provider';
import { useGlobalStore } from '@/providers/global-store-provider';

export const useMutationSendMessage = () => {
  const { conversationId } = useConversationContext();

  const model = useGlobalStore((s) => s.model);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const queryKey = trpc.conversationHistory.queryKey({ conversationId });

  return useMutation({
    mutationFn: async (content: string) => {
      queryClient.setQueryData(queryKey, (state) =>
        produce(state, (draft) => {
          if (!draft) draft = [];
          draft.unshift({
            messageId: `temp:${randomUuid()}`,
            conversationId,
            model,
            content,
            role: 'user',
            status: 'processing',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        })
      );

      const response = await fetch('/api/conversation', {
        method: 'POST',
        body: JSON.stringify({ conversationId, content, model } as ConversationBody),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const eventStream = response.body
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
            if (conversationId !== parsed.v.conversationId) {
              window.history.replaceState(null, '', `/c/${parsed.v.conversationId}`);
            }
          }
          if (parsed.type === 'message_processing') {
            queryClient.setQueryData(queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const index = draft.findIndex((m) => m.messageId === parsed.v.messageId);
                if (index !== -1) {
                  draft[index] = parsed.v;
                } else {
                  draft.unshift(parsed.v);
                }
              })
            );
          }
          if (parsed.type === 'message_done') {
            queryClient.setQueryData(queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                if (parsed.v.role === 'user') {
                  const index = draft.findIndex((m) => m.messageId.startsWith('temp:'));
                  if (index !== -1) {
                    draft[index] = parsed.v;
                  }
                }
                if (parsed.v.role === 'assistant') {
                  const index = draft.findIndex((m) => m.messageId === parsed.v.messageId);
                  if (index !== -1) {
                    draft[index] = parsed.v;
                  }
                }
              })
            );
          }
          if (parsed.type === 'content') {
            queryClient.setQueryData(queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.role === 'assistant' && m.status === 'processing');
                if (message && message.role === 'assistant') {
                  message.content += parsed.v;
                  message.recommendations = parseRecommendations(message.content, message.messageId);
                }
              })
            );
          }
        }
        if (event === 'end') {
          queryClient.invalidateQueries({ queryKey });
        }
      }
    },
  });
};
