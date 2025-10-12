'use client';

import { createContext, useContext } from 'react';

export function createContextFactory<T>(displayName: string) {
  const Context = createContext<T | undefined>(undefined);
  Context.displayName = displayName;

  const useContextHook = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within its Provider`);
    }
    return context;
  };

  const ContextProvider: React.FC<{ value: T; children: React.ReactNode }> = ({ value, children }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return [ContextProvider, useContextHook] as const;
}
