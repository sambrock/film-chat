import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import { produce } from 'immer';

import type { ChatBody, ChatSSEData } from '~/routes/api/chat';
import { deserialize, uuidV4 } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useChatContext } from '~/components/chat-page/chat-context-provider';
import { queryGetChatMessagesOptions } from './use-query-get-chat-messages';
import { queryGetChatsOptions, useQueryGetChatsUtils } from './use-query-get-chats';

export const useMutationSendMessage = () => {
  const { conversationId } = useChatContext();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isNewChat } = useQueryGetChatsUtils();

  const model = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return useMutation({
    mutationFn: async (content: string) => {
      dispatch({
        type: 'SET_CHAT_PROCESSING',
        payload: { conversationId, isNewChat: isNewChat(conversationId) },
      });

      if (isNewChat(conversationId)) {
        queryClient.setQueryData(queryGetChatsOptions().queryKey, (state) =>
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
        queryClient.setQueryData(queryGetChatsOptions().queryKey, (state) =>
          produce(state, (draft) => {
            if (!draft) draft = [];
            const index = draft.findIndex((c) => c.conversationId === conversationId);
            if (index !== -1) {
              draft[index].lastUpdateAt = new Date();
            }
          })
        );
      }

      let tempMessageUserId = uuidV4();
      let tempMessageAssistantId = uuidV4();

      queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
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

      let messageAssistantId: string;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const { event, data } = value;

        if (event === 'delta') {
          const parsed = deserialize<ChatSSEData>(data);

          if (parsed.type === 'chat') {
            queryClient.setQueryData(queryGetChatsOptions().queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const index = draft.findIndex((c) => c.conversationId === parsed.v.conversationId);
                if (index !== -1) {
                  draft[index] = parsed.v;
                }
              })
            );
            navigate({
              to: '/chat/$conversationId',
              params: { conversationId },
              replace: true,
            });
          }
          if (parsed.type === 'message') {
            if (parsed.v.role === 'assistant') {
              messageAssistantId = parsed.v.messageId;
            }
            queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
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
            queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.messageId === messageAssistantId);
                if (message && message.role === 'assistant') {
                  message.recommendations = parsed.v;
                }
              })
            );
          }
          if (parsed.type === 'movie') {
            queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.messageId === messageAssistantId);
                if (message && message.role === 'assistant') {
                  message.movies.push(parsed.v as any);
                }
              })
            );
          }
          if (parsed.type === 'content') {
            queryClient.setQueryData(queryGetChatMessagesOptions(conversationId).queryKey, (state) =>
              produce(state, (draft) => {
                if (!draft) draft = [];
                const message = draft.find((m) => m.messageId === messageAssistantId);
                if (message && message.role === 'assistant') {
                  message.content += parsed.v;
                }
              })
            );
          }
        }

        if (event === 'end') {
          dispatch({ type: 'SET_CHAT_DONE', payload: { conversationId } });
          if (isNewChat(conversationId)) {
            queryClient.invalidateQueries({
              queryKey: queryGetChatsOptions().queryKey,
            });
            queryClient.refetchQueries({
              queryKey: queryGetChatMessagesOptions(conversationId).queryKey,
            });
          }
        }
      }
    },
  });
};
