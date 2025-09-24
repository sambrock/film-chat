import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';
import { generateUuid } from '@/lib/utils';
import { ThreadContextProvider } from '@/providers/thread-context-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatWelcome } from '@/components/chat/chat-welcome';

type Props = {
  params?: Promise<{ thread_id?: string }>;
};

export default async function ChatPage({ params }: Props) {
  const paramThreadId = (await params)?.thread_id;

  const threadId = paramThreadId || generateUuid();
  const isPersisted = Boolean(paramThreadId);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.getThreadMessages.queryOptions({ threadId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadContextProvider threadId={threadId} isPersisted={isPersisted}>
        <main className="relative mx-auto grid w-full grid-rows-[calc(100vh-20px)_20px]">
          <div className="mx-auto w-full overflow-y-scroll p-3">
            <ChatWelcome className="mx-auto mt-[20vh] justify-self-center lg:w-3xl" />

            <ChatMessages className="mx-auto lg:w-3xl" />
          </div>

          <div className="mx-auto -mt-26 w-full p-3">
            <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
          </div>
        </main>
      </ThreadContextProvider>
    </HydrationBoundary>
  );
}
