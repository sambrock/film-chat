import { cache } from 'react';
import { env } from 'cloudflare:workers';
import createClient from 'openapi-fetch';

import { TMDbMovieDetails, TMDbMovieDetailsWithCredits, TMDbSearchMovieResult } from '../definitions';
// import { env } from '../utils/env';
import { paths } from './schema-v3';

export const tmdb = createClient<paths>({
  baseUrl: 'https://api.themoviedb.org',
  headers: {
    Authorization: `Bearer ${env.TMDB_API_KEY}`,
  },
});

export const tmdbFindMovie = cache(
  async (query: string, year: string): Promise<TMDbSearchMovieResult | null> => {
    const search = await tmdb.GET('/3/search/movie', {
      params: {
        query: { query, year, primary_release_year: year },
      },
    });

    if (!search.data || !search.data.results || search.data.results.length === 0) {
      return null;
    }

    const [result] = search.data.results;

    if (!result.id || !result.title || !result.release_date || !result.backdrop_path || !result.poster_path) {
      return null;
    }

    return result;
  }
);

export const tmdbGetMovieById = cache(async (movieId: number): Promise<TMDbMovieDetails | null> => {
  const { data } = await tmdb.GET(`/3/movie/{movie_id}`, {
    params: {
      path: { movie_id: movieId },
    },
  });

  if (!data || !data.id || !data.title || !data.release_date || !data.backdrop_path || !data.poster_path) {
    return null;
  }

  return data;
});

export const tmdbGetMovieByIdWithCredits = cache(
  async (movieId: number): Promise<TMDbMovieDetailsWithCredits | null> => {
    const { data } = await tmdb.GET(`/3/movie/{movie_id}`, {
      params: {
        path: { movie_id: movieId },
        query: { append_to_response: 'credits' },
      },
    });

    if (!data || !data.id || !data.title || !data.release_date || !data.backdrop_path || !data.poster_path) {
      return null;
    }

    return data as TMDbMovieDetailsWithCredits;
  }
);
