import { enableMapSet, produce } from 'immer';

import { Model } from '@/lib/ai/models';
import { GlobalState } from './global-store';

enableMapSet();

export type GlobalStoreAction =
  | {
      type: 'SET_MODEL';
      payload: { conversationId: string; model: Model };
    }
  | {
      type: 'SET_CHAT_VALUE';
      payload: { conversationId: string; value: string };
    }
  | {
      type: 'SET_CHAT_PROCESSING';
      payload: { conversationId: string };
    }
  | {
      type: 'SET_CHAT_DONE';
      payload: { conversationId: string };
    }
  | {
      type: 'OPEN_MOVIE_MODAL';
      payload: { movieId: string; source: 'recommendation' | 'library', conversationId?: string };
    }
  | {
      type: 'SET_MOVIE_MODAL_MOVIE_ID';
      payload: { movieId: string };
    }
  | {
      type: 'CLOSE_MOVIE_MODAL';
      payload: undefined;
    };

export const reducer = (state: GlobalState, { type, payload }: GlobalStoreAction) => {
  switch (type) {
    case 'SET_MODEL': {
      return produce(state, (draft) => {
        draft.model.set(payload.conversationId, payload.model);
      });
    }
    case 'SET_CHAT_VALUE': {
      return produce(state, (draft) => {
        draft.inputValue.set(payload.conversationId, payload.value);
        draft.defaultInputValue = payload.value;
      });
    }
    case 'SET_CHAT_PROCESSING': {
      return produce(state, (draft) => {
        draft.isProcessing.add(payload.conversationId);
      });
    }
    case 'SET_CHAT_DONE': {
      return produce(state, (draft) => {
        draft.isProcessing.delete(payload.conversationId);
      });
    }
    case 'OPEN_MOVIE_MODAL': {
      return produce(state, (draft) => {
        draft.movieModal = {
          isOpen: true,
          movieId: payload.movieId,
          shouldAnimate: true,
          source: payload.source,
          conversationId: payload.conversationId,
        };
      });
    }
    case 'SET_MOVIE_MODAL_MOVIE_ID': {
      return produce(state, (draft) => {
        if (!draft.movieModal) return;
        draft.movieModal = {
          ...draft.movieModal,
          movieId: payload.movieId,
          shouldAnimate: false,
        };
      });
    }
    case 'CLOSE_MOVIE_MODAL': {
      return produce(state, (draft) => {
        draft.movieModal = undefined;
      });
    }
    default: {
      return state;
    }
  }
};
