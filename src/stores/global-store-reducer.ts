import { enableMapSet, produce } from 'immer';

import { type Model } from '~/lib/ai/models';
import { type GlobalState } from './global-store';

enableMapSet();

export type GlobalStoreAction =
  | {
      type: 'SET_MODEL';
      payload: { conversationId: string; model: Model };
    }
  | {
      type: 'SET_CHAT_VALUE';
      payload: { conversationId: string; value: string; isNewChat?: boolean };
    }
  | {
      type: 'SET_CHAT_PROCESSING';
      payload: { conversationId: string; isNewChat?: boolean };
    }
  | {
      type: 'SET_CHAT_DONE';
      payload: { conversationId: string };
    }
  | {
      type: 'OPEN_MODAL_MOVIE_DETAILS';
      payload: { movieId: string };
    }
  | {
      type: 'SET_MODAL_MOVIE_DETAILS_MOVIE_ID';
      payload: { movieId: string };
    }
  | {
      type: 'CLOSE_MODAL_MOVIE_DETAILS';
      payload: undefined;
    }
  | {
      type: 'SET_RENAME_CHAT';
      payload: { conversationId: string } | undefined;
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
        if (payload.isNewChat) {
          // conversationId will change every time the new chat page is navigated to,
          // so use 'new' as a key so we can still preserve the input value
          draft.inputValue.set('new', payload.value);
        } else {
          draft.inputValue.set(payload.conversationId, payload.value);
        }
      });
    }
    case 'SET_CHAT_PROCESSING': {
      return produce(state, (draft) => {
        draft.isProcessing.add(payload.conversationId);
        draft.inputValue.set(payload.conversationId, '');
        if (payload.isNewChat) {
          draft.inputValue.delete('new');
        }
      });
    }
    case 'SET_CHAT_DONE': {
      return produce(state, (draft) => {
        draft.isProcessing.delete(payload.conversationId);
      });
    }
    case 'OPEN_MODAL_MOVIE_DETAILS': {
      return produce(state, (draft) => {
        draft.modalMovieDetails = {
          isOpen: true,
          shouldAnimate: true,
          movieId: payload.movieId,
        };
      });
    }
    case 'SET_MODAL_MOVIE_DETAILS_MOVIE_ID': {
      return produce(state, (draft) => {
        if (!draft.modalMovieDetails) return state;
        draft.modalMovieDetails.movieId = payload.movieId;
        draft.modalMovieDetails.shouldAnimate = false;
      });
    }
    case 'CLOSE_MODAL_MOVIE_DETAILS': {
      return produce(state, (draft) => {
        if (!draft.modalMovieDetails) return state;
        draft.modalMovieDetails.isOpen = false;
        draft.modalMovieDetails.shouldAnimate = true;
      });
    }
    case 'SET_RENAME_CHAT': {
      return produce(state, (draft) => {
        draft.renameChat = payload?.conversationId;
      });
    }
    default: {
      return state;
    }
  }
};
