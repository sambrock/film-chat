import { createContext, useContext } from 'react';

export type ChatContext = {
  conversationId: string;
};

export const ChatContext = createContext<ChatContext | undefined>(undefined);

type Props = {
  conversationId: string;
};

export const ChatContextProvider = (props: React.PropsWithChildren<Props>) => {
  return (
    <ChatContext.Provider value={{ conversationId: props.conversationId }}>
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatStoreProvider');
  }
  return context;
};
