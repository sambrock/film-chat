import { ChatContextProvider } from './chat-context-provider';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';
import { ChatWelcome } from './chat-welcome';

type Props = {
  conversationId: string;
};

export const ChatPage = ({ conversationId }: Props) => {
  return (
    <ChatContextProvider conversationId={conversationId}>
      <div className="group/chat relative flex h-full max-w-full flex-1 flex-col">
        <ChatHeader />

        <ChatWelcome className="h-full justify-center self-center lg:w-3xl" />
        <ChatMessages className="mx-auto lg:w-3xl" />

        <div className="group/input sticky bottom-0 isolate z-10 mt-auto w-full">
          <ChatInput className="mx-auto -mb-4 w-full shadow shadow-black/10 lg:w-3xl" />
          <div className="to-background-1 via-background-1 h-8 bg-gradient-to-b from-transparent" />
        </div>
      </div>
    </ChatContextProvider>
  );
};
