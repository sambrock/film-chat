import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import { produce } from 'immer';
import superjson from 'superjson';

import type { ChatBody, ChatSSEData } from '@/app/api/chat/route';
import { useTRPC } from '@/lib/trpc/client';
import { randomUuid } from '@/lib/utils/uuid';
import { useChatContext } from '@/providers/chat-context-provider';
import { useGlobalStore } from '@/providers/global-store-provider';

export const useMutationSendMessage = () => {
  const { conversationId } = useChatContext();

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const router = useRouter();

  const model = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return useMutation({
    mutationFn: async (content: string) => {
      dispatch({ type: 'SET_CHAT_PROCESSING', payload: { conversationId } });

      const isNewChat =
        queryClient
          .getQueryData(trpc.getChats.queryKey())
          ?.find((c) => c.conversationId === conversationId) == null;

      if (isNewChat) {
        queryClient.setQueryData(trpc.getChats.queryKey(), (state) =>
          produce(state, (draft) => {
            if (!draft) draft = [];
            draft.unshift({
              conversationId,
              title: '',
              userId: 'anon',
              lastUpdateAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          })
        );
      } else {
        queryClient.setQueryData(trpc.getChats.queryKey(), (state) =>
          produce(state, (draft) => {
            if (!draft) draft = [];
            const index = draft.findIndex((c) => c.conversationId === conversationId);
            if (index !== -1) {
              draft[index].lastUpdateAt = new Date();
            }
          })
        );
      }

      window.history.replaceState({}, '', `/c/${conversationId}`);

      let tempMessageUserId = randomUuid();
      let tempMessageAssistantId = randomUuid();

      queryClient.setQueryData(trpc.getChatMessages.queryKey(conversationId), (state) =>
        produce(state, (draft) => {
          if (!draft) draft = [];
          draft.unshift(
            {
              messageId: tempMessageAssistantId,
              conversationId,
              parentId: tempMessageUserId,
              userId: 'anon',
              content: '',
              model,
              role: 'assistant',
              status: 'processing',
              createdAt: new Date(),
              updatedAt: new Date(),
              recommendations: [],
              movies: [],
              libraries: [],
            },
            {
              messageId: tempMessageUserId,
              conversationId,
              userId: 'anon',
              content,
              model,
              role: 'user',
              status: 'processing',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          );
        })
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          content,
          model,
        } as ChatBody),
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
          const parsed = superjson.parse<ChatSSEData>(data);

          if (parsed.type === 'chat') {
            console.log(conversationId, parsed.v.conversationId);
            queryClient.setQueryData(trpc.getChats.queryKey(), (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const index = draft.findIndex((c) => c.conversationId === parsed.v.conversationId);
                if (index !== -1) {
                  draft[index] = parsed.v;
                }
              })
            );
            queryClient.setQueryData(trpc.getChat.queryKey(conversationId), parsed.v);
          }
          if (parsed.type === 'message') {
            queryClient.setQueryData(trpc.getChatMessages.queryKey(conversationId), (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                // Remove temp messages
                if (parsed.v.role === 'user') {
                  const index = draft.findIndex((m) => m.messageId === tempMessageUserId);
                  if (index !== -1) {
                    draft.splice(index, 1);
                  }
                }
                if (parsed.v.role === 'assistant') {
                  const index = draft.findIndex((m) => m.messageId === tempMessageAssistantId);
                  if (index !== -1) {
                    draft.splice(index, 1);
                  }
                }
                // Upsert new message
                const index = draft.findIndex((m) => m.messageId === parsed.v.messageId);
                if (index !== -1) {
                  draft[index] = parsed.v;
                } else {
                  draft.unshift(parsed.v);
                }
              })
            );
          }
          if (parsed.type === 'recommendations') {
            queryClient.setQueryData(trpc.getChatMessages.queryKey(conversationId), (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.messageId === parsed.id);
                if (message && message.role === 'assistant') {
                  message.recommendations = parsed.v;
                }
              })
            );
          }
          if (parsed.type === 'movie') {
            queryClient.setQueryData(trpc.getChatMessages.queryKey(conversationId), (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.messageId === parsed.id);
                if (message && message.role === 'assistant') {
                  message.movies.push(parsed.v);
                }
              })
            );
          }
          if (parsed.type === 'content') {
            queryClient.setQueryData(trpc.getChatMessages.queryKey(conversationId), (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.messageId === parsed.id);
                if (message && message.role === 'assistant') {
                  message.content += parsed.v;
                }
              })
            );
          }
        }

        if (event === 'end') {
          dispatch({ type: 'SET_CHAT_DONE', payload: { conversationId } });
          if (isNewChat) {
            requestAnimationFrame(() => router.push(`/c/${conversationId}`));
          }
        }
      }
    },
  });
};
