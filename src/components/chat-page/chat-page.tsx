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
      <div className="group/chat relative flex h-full min-h-screen max-w-full flex-col">
        <ChatHeader />

        <ChatWelcome className="grow justify-center self-center px-3 lg:w-3xl" />
        <ChatMessages className="mx-auto h-full w-full px-3 lg:w-3xl" />

        <div className="group/input sticky bottom-0 isolate z-10 mx-auto mt-auto w-full px-3 lg:w-3xl">
          <ChatInput className="-mb-4 w-full shadow shadow-black/10" />
          <div className="to-background via-background h-8 bg-gradient-to-b from-transparent" />
        </div>
      </div>
    </ChatContextProvider>
  );
};
