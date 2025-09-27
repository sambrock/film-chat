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
      type: 'SET_INPUT_VALUE';
      payload: { conversationId: string; value?: string; isPersisted: boolean };
    }
  | {
      type: 'SET_CHAT_IN_PROGRESS';
      payload: { conversationId: string };
    }
  | {
      type: 'SET_CHAT_DONE';
      payload: { conversationId: string };
    };

export const reducer = (state: GlobalState, { type, payload }: GlobalStoreAction) => {
  switch (type) {
    case 'SET_MODEL': {
      return produce(state, (draft) => {
        draft.model = payload.model;
        draft.chatModel.set(payload.conversationId, payload.model);
      });
    }
    case 'SET_INPUT_VALUE': {
      return produce(state, (draft) => {
        if (!payload.value) {
          draft.chatInputValue.delete(payload.conversationId);
          draft.chatInputValue.delete('new');
          return;
        }
        if (!payload.isPersisted) {
          draft.chatInputValue.set('new', payload.value);
          return;
        }
        draft.chatInputValue.set(payload.conversationId, payload.value);
      });
    }
    case 'SET_CHAT_IN_PROGRESS': {
      return produce(state, (draft) => {
        draft.chatInProgress.add(payload.conversationId);
        draft.chatInputValue.delete(payload.conversationId);
        // if (!payload.isPersisted) {
        //   draft.chatInputValue.delete('new');
        // }
      });
    }
    case 'SET_CHAT_DONE': {
      return produce(state, (draft) => {
        draft.chatInProgress.delete(payload.conversationId);
        // if (draft.activeconversationId !== payload.conversationId) {
        //   draft.chatUnseenUpdates.add(payload.conversationId);
        // }
      });
    }
    default: {
      return state;
    }
  }
};
