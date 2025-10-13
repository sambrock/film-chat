import { ChatContextProvider } from '@/providers/chat-context-provider';
import { ChatHeader, ChatHeaderSkeleton } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ClientOnly } from '@/components/common/client-only';
import { MovieDetailsModal } from '@/components/movie/movie-details-modal';

type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { conversationId } = await params;

  return (
    <ChatContextProvider conversationId={conversationId}>
      <main className="relative mx-auto grid w-full grid-rows-[0px_calc(100vh-20px)_20px] overflow-y-hidden">
        <ClientOnly fallback={<ChatHeaderSkeleton />}>
          <ChatHeader />
        </ClientOnly>

        <div className="mx-auto w-full overflow-y-scroll p-3 pt-12">
          <ClientOnly>
            <ChatMessages className="mx-auto lg:w-3xl" />
          </ClientOnly>
        </div>

        <div className="mx-auto -mt-26 w-full p-3">
          <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
        </div>
      </main>

      <ClientOnly>
        <MovieDetailsModal />
      </ClientOnly>
    </ChatContextProvider>
  );
}
