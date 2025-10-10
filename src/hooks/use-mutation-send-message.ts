import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import superjson from 'superjson';

import type { ChatBody, ChatSSEData } from '@/app/api/chat/route';
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

  const router = useRouter();

  const model = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return useMutation({
    mutationFn: async (content: string) => {
      dispatch({ type: 'SET_CHAT_PROCESSING', payload: { conversationId } });

      const isNewChat = !chatsCollection.has(conversationId);
      if (isNewChat) {
        chatsCollection.utils.writeInsert({
          conversationId,
          userId: '',
          title: 'New chat',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        window.history.replaceState({}, '', `/c/${conversationId}`);
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

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const { event, data } = value;

        if (event === 'delta') {
          const parsed = superjson.parse<ChatSSEData>(data);

          if (parsed.type === 'chat') {
            chatsCollection.utils.writeUpsert(parsed.v);
          }
          if (parsed.type === 'message') {
            messagesCollection.utils.writeUpsert(parsed.v);
          }
          if (parsed.type === 'recommendations') {
            recommendationsCollection.utils.writeBatch(() =>
              parsed.v.map((v) => recommendationsCollection.utils.writeInsert(v))
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
          dispatch({ type: 'SET_CHAT_DONE', payload: { conversationId } });
          if (isNewChat) {
            router.push(`/c/${conversationId}`);
          }
        }
      }
    },
  });
};
