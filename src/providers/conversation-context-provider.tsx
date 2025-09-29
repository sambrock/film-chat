'use client';

import { createContext, useContext } from 'react';

export type ConversationContext = {
  conversationId: string;
};

export const ConversationContext = createContext<ConversationContext | undefined>(undefined);

export const ConversationContextProvider = ({
  conversationId,
  ...props
}: React.PropsWithChildren<{ conversationId: string }>) => {
  return (
    <ConversationContext.Provider value={{ conversationId }}>{props.children}</ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(`useConversationContext must be used within ConversationContextProvider`);
  }

  return context;
};
