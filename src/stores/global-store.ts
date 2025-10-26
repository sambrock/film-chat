import { persist, StorageValue } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Model } from '~/lib/ai/models';
import { deserialize, serialize } from '~/lib/utils';
import { GlobalStoreAction, reducer } from './global-store-reducer';

export type GlobalState = {
  defaultModel: Model;

  model: Map<string, Model>; // Map<conversationId, model>
  inputValue: Map<string, string>; // Map<conversationId, inputValue>
  isProcessing: Set<string>; // Set<conversationId>

  modalMovieDetails?: {
    isOpen: boolean;
    movieId: string;
    shouldAnimate: boolean;
  };

  renameChat?: string;
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

        modalMovieDetails: undefined,

        renameChat: undefined,

        dispatch: (action) => set((state) => reducer(state, action)),
      }),
      {
        name: 'fc-store',
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return deserialize<StorageValue<GlobalState>>(str);
          },
          setItem: (name, value) => {
            localStorage.setItem(name, serialize(value));
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
