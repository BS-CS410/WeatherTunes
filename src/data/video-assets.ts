/**
 * Video assets mapped to weather conditions
 */
export interface VideoAsset {
  id: string;
  path: string;
  className: string;
}

/**
 * Map of weather conditions to video assets
 * Key: OpenWeatherMap condition code
 */
export const WEATHER_VIDEOS: Record<string, VideoAsset> = {
  // Clear sky
  '01d': {
    id: 'clear-day',
    path: '/videos/clear-day.mp4',
    className: 'weather-clear-day'
  },
  '01n': {
    id: 'clear-night',
    path: '/videos/clear-night.mp4',
    className: 'weather-clear-night'
  },
  
  // Few clouds
  '02d': {
    id: 'partly-cloudy-day',
    path: '/videos/partly-cloudy-day.mp4',
    className: 'weather-partly-cloudy-day'
  },
  '02n': {
    id: 'partly-cloudy-night',
    path: '/videos/partly-cloudy-night.mp4',
    className: 'weather-partly-cloudy-night'
  },
  
  // Scattered clouds
  '03d': {
    id: 'cloudy-day',
    path: '/videos/cloudy-day.mp4',
    className: 'weather-cloudy-day'
  },
  '03n': {
    id: 'cloudy-night',
    path: '/videos/cloudy-night.mp4',
    className: 'weather-cloudy-night'
  },
  
  // Broken clouds
  '04d': {
    id: 'overcast-day',
    path: '/videos/overcast-day.mp4',
    className: 'weather-overcast-day'
  },
  '04n': {
    id: 'overcast-night',
    path: '/videos/overcast-night.mp4',
    className: 'weather-overcast-night'
  },
  
  // Showers (light rain)
  '09d': {
    id: 'showers-day',
    path: '/videos/showers-day.mp4',
    className: 'weather-showers-day'
  },
  '09n': {
    id: 'showers-night',
    path: '/videos/showers-night.mp4',
    className: 'weather-showers-night'
  },
  
  // Rain
  '10d': {
    id: 'rain-day',
    path: '/videos/rain-day.mp4',
    className: 'weather-rain-day'
  },
  '10n': {
    id: 'rain-night',
    path: '/videos/rain-night.mp4',
    className: 'weather-rain-night'
  },
  
  // Thunderstorm
  '11d': {
    id: 'thunderstorm-day',
    path: '/videos/thunderstorm-day.mp4',
    className: 'weather-thunderstorm-day'
  },
  '11n': {
    id: 'thunderstorm-night',
    path: '/videos/thunderstorm-night.mp4',
    className: 'weather-thunderstorm-night'
  },
  
  // Snow
  '13d': {
    id: 'snow-day',
    path: '/videos/snow-day.mp4',
    className: 'weather-snow-day'
  },
  '13n': {
    id: 'snow-night',
    path: '/videos/snow-night.mp4',
    className: 'weather-snow-night'
  },
  
  // Mist/Fog
  '50d': {
    id: 'fog-day',
    path: '/videos/fog-day.mp4',
    className: 'weather-fog-day'
  },
  '50n': {
    id: 'fog-night',
    path: '/videos/fog-night.mp4',
    className: 'weather-fog-night'
  }
};

/**
 * Get video asset for a specific weather condition
 * @param condition OpenWeatherMap condition code (e.g., '01d', '09n')
 * @returns VideoAsset for the condition or default clear sky if not found
 */
export function getVideoForCondition(condition: string): VideoAsset {
  // Default to clear sky day if condition not found
  return WEATHER_VIDEOS[condition] || WEATHER_VIDEOS['01d'];
}

/**
 * Get all video assets as an array
 * @returns Array of VideoAsset objects
 */
export function getAllVideoAssets(): VideoAsset[] {
  return Object.values(WEATHER_VIDEOS);
}

/**
 * Get all video paths as an array
 * Useful for preloading videos
 * @returns Array of unique video paths
 * @example
 * ```typescript
 * // Preload all video assets
 * const videoPaths = getAllVideoPaths();
 * videoPaths.forEach(path => {
 *   const video = document.createElement('video');
 *   video.src = path;
 *   video.preload = 'auto';
 * });
 * ```
 */
export function getAllVideoPaths(): string[] {
  // Use a Set to ensure unique paths in case multiple conditions use the same video
  const uniquePaths = new Set<string>();
  
  // Add all video paths to the Set
  Object.values(WEATHER_VIDEOS).forEach(video => {
    uniquePaths.add(video.path);
  });
  
  return Array.from(uniquePaths);
}

/**
 * Get a list of all unique weather condition codes
 * @returns Array of weather condition codes (e.g., ['01d', '01n', '02d', ...])
 */
export function getAllWeatherConditionCodes(): string[] {
  return Object.keys(WEATHER_VIDEOS);
}

/**
 * Check if a weather condition code is valid
 * @param condition Weather condition code to check
 * @returns boolean indicating if the condition code is valid
 */
export function isValidWeatherCondition(condition: string): boolean {
  return condition in WEATHER_VIDEOS;
}
