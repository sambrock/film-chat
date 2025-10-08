'use client';

import type { ConversationMessage, Library, Message, Movie, Recommendation } from '@/lib/definitions';
import { createContextFactory } from '@/lib/utils/create-context-factory';

export const [ChatContextProvider, useChatContext] = createContextFactory<{
  conversationId: string;
}>('ChatContext');

export const [ChatMessageContextProvider, useChatMessageContext] = createContextFactory<{
  message: Message;
}>('MessageContext');

export const [ChatRecommendationContextProvider, useChatRecommendationContext] = createContextFactory<{
  recommendation: Recommendation;
  movie?: Movie;
  library?: Library;
}>('RecommendationContext');
