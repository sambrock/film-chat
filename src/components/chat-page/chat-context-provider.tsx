'use client';

import { createContext, useContext } from 'react';

export type ChatStoreContext = {
  conversationId: string;
};

export const ChatStoreContext = createContext<ChatStoreContext | undefined>(undefined);

type Props = {
  conversationId: string;
};

export const ChatContextProvider = (props: React.PropsWithChildren<Props>) => {
  return (
    <ChatStoreContext.Provider value={{ conversationId: props.conversationId }}>
      {props.children}
    </ChatStoreContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatStoreProvider');
  }
  return context;
};
