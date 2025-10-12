'use client';

import { createContext, useContext } from 'react';

export type ChatStoreContext = { conversationId: string };

export const ChatStoreContext = createContext<ChatStoreContext | undefined>(undefined);

export const ChatContextProvider = (
  props: React.PropsWithChildren<{
    conversationId: string;
  }>
) => {
  return (
    <ChatStoreContext.Provider value={{ conversationId: props.conversationId }}>
      {props.children}
    </ChatStoreContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error(`useChatContext must be used within ChatStoreProvider`);
  }
  return context;
};
