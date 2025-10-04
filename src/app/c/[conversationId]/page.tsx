import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { randomUuid } from '@/lib/utils/uuid';
import { ConversationContextProvider } from '@/providers/conversation-context-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatWelcome } from '@/components/chat/chat-welcome';
import { HeaderChat } from '@/components/layout/header-chat';
import { MovieModal } from '@/components/movie/movie-modal';

type Props = {
  params?: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = params ? await params : {};

  const queryClient = getQueryClient();
  if (conversationId) {
    await queryClient.prefetchQuery(trpc.conversationHistory.queryOptions({ conversationId }));
    await queryClient.prefetchQuery(trpc.conversation.queryOptions({ conversationId }));

    // TODO: if movie modal open, get movie id from query and prefetch
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConversationContextProvider conversationId={conversationId || randomUuid()}>
        <main className="relative mx-auto grid w-full grid-rows-[48px_calc(100vh-70px)_20px] overflow-y-hidden">
          <HeaderChat />

          <div className="mx-auto w-full overflow-y-scroll p-3">
            <ChatWelcome className="mx-auto mt-[20vh] justify-self-center lg:w-3xl" />

            <ChatMessages className="mx-auto lg:w-3xl" />
          </div>

          <div className="mx-auto -mt-26 w-full p-3">
            <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
          </div>
        </main>

        <MovieModal />
      </ConversationContextProvider>
    </HydrationBoundary>
  );
}
