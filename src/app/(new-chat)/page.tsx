import { ChatContextProvider } from '@/providers/chat-context-provider';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatWelcome } from '@/components/chat/chat-welcome';

export default async function NewChatPage() {
  'use cache';

  return (
    <ChatContextProvider conversationId="new">
      <main className="relative mx-auto grid w-full grid-rows-[0px_calc(100vh-20px)_20px] overflow-y-hidden">
        {/* <ChatHeader /> */}
        <div></div>

        <div className="mx-auto w-full overflow-y-scroll p-3 pt-12">
          <ChatWelcome className="mx-auto h-[calc(100%-104px)] lg:w-3xl" />
        </div>

        <div className="mx-auto -mt-26 w-full p-3">
          <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
        </div>
      </main>
    </ChatContextProvider>
  );
}
