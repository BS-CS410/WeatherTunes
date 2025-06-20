/**
 * Service for live Spotify API integration
 * Migration: Now using frontend-only implementation with direct Spotify API calls
 */

// Re-export the frontend API service to maintain compatibility
export {
  spotifyApiService as SpotifyApiService,
  type SpotifySearchResult,
  type WeatherRecommendationRequest,
  type WeatherRecommendationResponse,
  type UserMusicPreferences,
} from "./spotify-api-frontend";
