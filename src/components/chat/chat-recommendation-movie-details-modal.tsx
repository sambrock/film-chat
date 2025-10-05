'use client';

import { useGlobalStore } from '@/providers/global-store-provider';
import { MovieDetailsModal } from '../movie/movie-details-modal';
import { useChatRecommendationContext } from './chat-context';
import { ChatMovieActionButtonAddToWatchlist } from './chat-movie-actions';

export const ChatRecommendationMovieDetailsModal = () => {
  const { recommendation, movie } = useChatRecommendationContext();
  const isOpen = useGlobalStore((s) => s.modalOpenRecommendationId === recommendation.recommendationId);

  if (!movie) {
    return null;
  }
  return (
    <MovieDetailsModal
      isOpen={isOpen}
      movieId={movie.movieId}
      initialData={movie}
      addToWatchlistButton={<ChatMovieActionButtonAddToWatchlist />}
    />
  );
};
