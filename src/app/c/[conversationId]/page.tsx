import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { randomUuid } from '@/lib/utils/uuid';
import { ChatContextProvider } from '@/components/chat/chat-context';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatWelcome } from '@/components/chat/chat-welcome';

type Props = {
  params?: Promise<{ conversationId: string }>;
  query?: Promise<{ m?: string }>; // movieId
};

export default async function ConversationPage({ params, query }: Props) {
  const { conversationId } = params ? await params : {};
  const { m } = query ? await query : {};

  const queryClient = getQueryClient();
  await Promise.all([
    conversationId
      ? queryClient.prefetchQuery(trpc.conversationHistory.queryOptions({ conversationId }))
      : null,
    conversationId ? queryClient.prefetchQuery(trpc.conversation.queryOptions({ conversationId })) : null,
    m ? queryClient.prefetchQuery(trpc.movie.queryOptions({ movieId: m })) : null,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatContextProvider value={{ conversationId: conversationId ?? randomUuid() }}>
        <main className="relative mx-auto grid w-full grid-rows-[48px_calc(100vh-70px)_20px] overflow-y-hidden">
          <ChatHeader />

          <div className="mx-auto w-full overflow-y-scroll p-3">
            <ChatWelcome className="mx-auto mt-[20vh] justify-self-center lg:w-3xl" />
            <ChatMessages className="mx-auto lg:w-3xl" />
          </div>

          <div className="mx-auto -mt-26 w-full p-3">
            <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
          </div>
        </main>
      </ChatContextProvider>
    </HydrationBoundary>
  );
}
