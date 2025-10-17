import { createContext, useContext } from 'react';

import type { Library } from '~/lib/definitions';

export type MovieDetailsModalContext =
  | { page: 'chat'; messageId: string; conversationId: string; library?: Library }
  | { page: 'library'; library?: Library };

export const MovieDetailsModalContext = createContext<MovieDetailsModalContext | undefined>(undefined);

type Props = { value: MovieDetailsModalContext };

export const MovieDetailsModalContextProvider = ({ value, ...props }: React.PropsWithChildren<Props>) => {
  return (
    <MovieDetailsModalContext.Provider value={value}>{props.children}</MovieDetailsModalContext.Provider>
  );
};

export const useMovieDetailsModalContext = () => {
  const context = useContext(MovieDetailsModalContext);
  if (!context) {
    throw new Error('useMovieDetailsModalContext must be used within MovieDetailsModalContextProvider');
  }
  return context;
};
