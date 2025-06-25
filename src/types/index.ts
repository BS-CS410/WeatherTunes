/**
 * Primary entry point for all shared types.
 * This file should export all other types from the other files in this directory,
 * making it easier to import types from a single location.
 */

// For API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

// For paginated API responses
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// For representing the state of async operations
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export * from './auth';
export * from './queue-types';
export * from './spotify-api-types';
export * from './units-types';
export * from './weather-types';
