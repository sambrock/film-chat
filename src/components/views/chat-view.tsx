import { ChatContextProvider } from '~/providers/chat-context-provider';
import { ChatHeader } from '../chat/chat-header';
import { ChatInput } from '../chat/chat-input';
import { ChatMessages } from '../chat/chat-messages';
import { ChatWelcome } from '../chat/chat-welcome';

type Props = {
  conversationId: string;
};

export const ChatView = ({ conversationId }: Props) => {
  return (
    <ChatContextProvider conversationId={conversationId}>
      <main className="relative mx-auto grid w-full grid-rows-[0px_calc(100vh-20px)_20px] overflow-y-hidden">
        <ChatHeader />

        <div className="mx-auto w-full overflow-y-scroll p-3 pt-12">
          <ChatWelcome className="mx-auto h-[calc(100vh-140px)] lg:w-3xl" />
          <ChatMessages className="mx-auto lg:w-3xl" />
        </div>

        <div className="mx-auto -mt-26 w-full p-3">
          <ChatInput className="relative z-10 mx-auto w-full shadow-xl shadow-black/10 lg:w-3xl" />
        </div>
      </main>
    </ChatContextProvider>
  );
};
