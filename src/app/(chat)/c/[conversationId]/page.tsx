import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { ChatContextProvider } from '@/providers/chat-context-provider';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';

type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { conversationId } = await params;

  const SuspenseChatHeader = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.getChat.queryOptions(conversationId));

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatHeader />
      </HydrationBoundary>
    );
  };

  const SuspenseChatMessages = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.getChatMessages.queryOptions(conversationId));

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatMessages className="mx-auto lg:w-3xl" />
      </HydrationBoundary>
    );
  };

  return (
    <ChatContextProvider conversationId={conversationId}>
      <main className="relative mx-auto grid w-full grid-rows-[0px_calc(100vh-20px)_20px] overflow-y-hidden">
        <SuspenseChatHeader />
        {/* <ChatHeader /> */}

        <div className="mx-auto w-full overflow-y-scroll p-3 pt-12">
          <SuspenseChatMessages />
          {/* <ChatMessages className="mx-auto lg:w-3xl" /> */}
        </div>

        <div className="mx-auto -mt-26 w-full p-3">
          <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
        </div>
      </main>

      {/* <MovieDetailsModal /> */}
    </ChatContextProvider>
  );
}
