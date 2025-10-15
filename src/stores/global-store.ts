import superjson from 'superjson';
import { persist, StorageValue } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '~/lib/ai/models';
import { GlobalStoreAction, reducer } from './global-store-reducer';

export type GlobalState = {
  defaultModel: Model;
  defaultInputValue: string;

  model: Map<string, Model>; // Map<conversationId, model>
  inputValue: Map<string, string>; // Map<conversationId, inputValue>
  isProcessing: Set<string>; // Set<conversationId>

  movieModal?: {
    isOpen: boolean;
    movieId: string;
    shouldAnimate: boolean;
    source?: 'recommendation' | 'library';
    conversationId?: string;
  };
};

export type GlobalStore = GlobalState & {
  dispatch: (action: GlobalStoreAction) => void;
};

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(
    persist(
      (set) => ({
        defaultModel: 'openai/gpt-4.1-nano',
        defaultInputValue: '',

        model: new Map(),
        inputValue: new Map(),
        isProcessing: new Set(),

        movieModal: undefined,

        dispatch: (action) => set((state) => reducer(state, action)),
      }),
      {
        name: 'fc/store',
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return superjson.parse(str) as StorageValue<GlobalState>;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, superjson.stringify(value));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
        // Don't include dispatch in the persisted state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ dispatch, ...state }) => state,
      }
    )
  );
};
