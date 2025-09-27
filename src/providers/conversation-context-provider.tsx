'use client';

import { createContext, useContext, useState } from 'react';

export type ConversationContext = {
  conversationId: string;
  setConversationId: (conversationId: string) => void;
};

export const ConversationContext = createContext<ConversationContext | undefined>(undefined);

export const ConversationContextProvider = (props: React.PropsWithChildren<{ conversationId?: string }>) => {
  const [conversationId, setConversationId] = useState(props.conversationId || '');

  return (
    <ConversationContext.Provider value={{ conversationId, setConversationId }}>
      {props.children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(`useConversationContext must be used within ConversationContextProvider`);
  }

  return context;
};
