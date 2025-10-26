import { clsx, type ClassValue } from 'clsx';
import superjson from 'superjson';
import { twMerge } from 'tailwind-merge';
import { v4, v5 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uuidV4 = () => {
  return v4();
};

export const uuidV5 = (value: string) => {
  return v5(value, v5.DNS);
};

export const serialize = (data: any) => {
  return superjson.stringify(data);
};

export const deserialize = <T>(data: string) => {
  return superjson.parse<T>(data);
};

export const timeAgo = (date: Date) => {
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  if (secondsPast < 60) {
    return 'just now';
  } else if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 2592000) {
    // Approximately 30 days in a month
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (secondsPast <= 31536000) {
    // Approximately 365 days in a year
    const months = Math.floor(secondsPast / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(secondsPast / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

export const runtimeToHoursMins = (runtimeMins: number) => {
  const hours = Math.floor(runtimeMins / 60);
  const minutes = runtimeMins % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};

export const tmdbPosterSrc = (
  posterPath: string,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
) => {
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const tmdbBackdropSrc = (backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original') => {
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
};

export const genreName = (name: string) => {
  if (name === 'Science Fiction') {
    return 'Sci-Fi';
  }
  return name;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StringLiterals<T> = T extends string ? (string extends T ? never : T) : never;

export type MapKey<T> = T extends Map<infer K, unknown> ? K : never;
