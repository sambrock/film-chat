import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { randomUuid } from '@/lib/utils/uuid';
import { ConversationContextProvider } from '@/providers/conversation-context-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatWelcome } from '@/components/chat/chat-welcome';

type Props = {
  params?: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = params ? await params : {};

  const queryClient = getQueryClient();
  if (conversationId) {
    await queryClient.prefetchQuery(trpc.conversationHistory.queryOptions({ conversationId }));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConversationContextProvider conversationId={conversationId || randomUuid()}>
        <main className="relative mx-auto grid w-full grid-rows-[calc(100vh-20px)_20px]">
          <div className="mx-auto w-full overflow-y-scroll p-3">
            <ChatWelcome className="mx-auto mt-[20vh] justify-self-center lg:w-3xl" />

            <ChatMessages className="mx-auto lg:w-3xl" />
          </div>

          <div className="mx-auto -mt-26 w-full p-3">
            <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
          </div>
        </main>
      </ConversationContextProvider>
    </HydrationBoundary>
  );
}
