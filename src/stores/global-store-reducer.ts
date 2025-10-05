import { enableMapSet, produce } from 'immer';

import { Model } from '@/lib/ai/models';
import { GlobalState } from './global-store';

enableMapSet();

export type GlobalStoreAction =
  | {
      type: 'SET_CONVERSATION_VALUE';
      payload: { conversationId: string; value: string };
    }
  | {
      type: 'SET_MODEL';
      payload: { conversationId: string; model: Model };
    }
  | {
      type: 'SET_CONVERSATION_PROCESSING';
      payload: { conversationId: string };
    }
  | {
      type: 'SET_CONVERSATION_DONE';
      payload: { conversationId: string };
    }
  | {
      type: 'OPEN_RECOMMENDATION_MOVIE_MODAL';
      payload: { recommendationId: string };
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
    case 'SET_CONVERSATION_VALUE': {
      return produce(state, (draft) => {
        draft.inputValue.set(payload.conversationId, payload.value);
        draft.defaultInputValue = payload.value;
      });
    }
    case 'SET_CONVERSATION_PROCESSING': {
      return produce(state, (draft) => {
        draft.isProcessing.add(payload.conversationId);
      });
    }
    case 'SET_CONVERSATION_DONE': {
      return produce(state, (draft) => {
        draft.isProcessing.delete(payload.conversationId);
      });
    }
    case 'OPEN_RECOMMENDATION_MOVIE_MODAL': {
      return produce(state, (draft) => {
        draft.modalOpenRecommendationId = payload.recommendationId;
        draft.modalOpenShouldAnimate = state.modalOpenRecommendationId === '';
      });
    }
    case 'CLOSE_MOVIE_MODAL': {
      return produce(state, (draft) => {
        draft.modalOpenRecommendationId = '';
        draft.modalOpenShouldAnimate = true;
      });
    }
    default: {
      return state;
    }
  }
};
