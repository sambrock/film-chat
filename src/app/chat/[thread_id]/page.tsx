import { fetchQuery } from 'convex/nextjs';

import { api } from '@/infra/convex/_generated/api';
import { Doc } from '@/infra/convex/_generated/dataModel';
import { ThreadContextProvider } from '@/providers/thread-context-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatWelcome } from '@/components/chat/chat-welcome';

type Props = {
  params: Promise<{ thread_id: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { thread_id } = await params;
  const initialData = await fetchQuery(api.messages.getByThreadId, { threadId: thread_id });

  return <ChatPageComponent threadId={thread_id} isPersisted={true} initialData={initialData} />;
}

// Same component is used for new chat and existing chat (see src/app/page.tsx)
export const ChatPageComponent = ({
  threadId,
  isPersisted,
  initialData,
}: {
  threadId: string;
  isPersisted: boolean;
  initialData: Doc<'messages'>[];
}) => {
  return (
    <ThreadContextProvider threadId={threadId} isPersisted={isPersisted}>
      <main className="relative mx-auto grid w-full grid-rows-[calc(100vh-20px)_20px]">
        <div className="mx-auto w-full overflow-y-scroll p-3">
          <ChatWelcome
            initialIsActive={initialData?.length === 0}
            className="mx-auto mt-[20vh] justify-self-center lg:w-3xl"
          />

          <ChatMessages className="mx-auto lg:w-3xl" initialData={initialData} />
        </div>

        <div className="mx-auto -mt-26 w-full p-3">
          <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
        </div>
      </main>
    </ThreadContextProvider>
  );
};
