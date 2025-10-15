'use client';

import { createContext, useContext, useState } from 'react';

export type ChatStoreContext = {
  conversationId: string;
  isNewChat: boolean;
  setIsNewChat: (isNew: boolean) => void;
};

export const ChatStoreContext = createContext<ChatStoreContext | undefined>(undefined);

type Props = {
  conversationId: string;
  isNewChat: boolean;
};

export const ChatContextProvider = (props: React.PropsWithChildren<Props>) => {
  const [isNewChat, setIsNewChat] = useState(props.isNewChat);

  return (
    <ChatStoreContext.Provider value={{ conversationId: props.conversationId, isNewChat, setIsNewChat }}>
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
