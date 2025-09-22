'use client';

import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { authAction } from '@/app/actions/auth-action';

export type SessionContext = {
  session: string;
};

export const SessionContext = createContext<SessionContext | undefined>(undefined);

export const SessionContextProvider = (props: React.PropsWithChildren) => {
  const [localStorageSession, setLocalStorageSession] = useLocalStorage('fc/session', '');

  const initSession = async () => {
    if (localStorageSession) return;
    const session = await authAction();
    if (!session) {
      throw new Error('Failed to create session');
    }
    setLocalStorageSession(session);
  };

  useEffect(() => {
    initSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session: localStorageSession }}>
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(`useSessionContext must be used within SessionContextProvider`);
  }

  return context;
};
