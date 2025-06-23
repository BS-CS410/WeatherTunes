/**
 * Weather-aware queue generation using the new queue system
 */

import { useWeatherData } from "./useWeatherData";
import { useCallback } from "react";
import { useSpotifyQueue } from "./spotify";
import { useWeatherTime } from "./common";
import type { TrackMetadata } from "@/types/queue-types";
import { getVideoForCondition } from "@/data/video-assets";
import { generateWeatherPlaylist } from "@/lib/music/recommendations";

interface UseWeatherQueueReturn {
  generateWeatherQueue: (count?: number) => Promise<TrackMetadata[]>;
  replaceQueueWithWeatherTracks: (count?: number) => Promise<void>;
}

/**
 * Hook for generating weather-based queues
 */
export function useWeatherQueue(): UseWeatherQueueReturn {
  const weatherState = useWeatherData();
  const { replaceQueue } = useSpotifyQueue();
  const { getCurrentTimeOfDay } = useWeatherTime();

  // Extract stable values to avoid unnecessary re-renders
  const condition = weatherState.displayData?.condition || "clear sky";
  const temperature = weatherState.rawResponse?.main.temp || 20;

  const generateWeatherQueue = useCallback(
    async (count = 15): Promise<TrackMetadata[]> => {
      try {
        const timeOfDay = getCurrentTimeOfDay();

        console.log(
          `Generating weather queue: ${condition}, ${temperature}°C, ${timeOfDay}`,
        );

        const tracks = await generateWeatherPlaylist(
          condition,
          temperature,
          timeOfDay,
          count,
        );

        console.log(
          `Generated ${tracks.length} weather-based tracks for queue.`,
        );

        // Add video metadata to tracks
        return tracks.map((track) => {
          const videoAsset = getVideoForCondition(condition);
          return {
            ...track,
            videoUrl: videoAsset.path,
            videoClass: videoAsset.className || "",
          };
        });
      } catch (error) {
        console.error("Failed to generate weather queue:", error);
        return [];
      }
    },
    [condition, temperature, getCurrentTimeOfDay],
  );

  const replaceQueueWithWeatherTracks = useCallback(
    async (count = 15): Promise<void> => {
      const tracks = await generateWeatherQueue(count);
      if (tracks.length > 0) {
        await replaceQueue(tracks);
      }
    },
    [generateWeatherQueue, replaceQueue],
  );

  return {
    generateWeatherQueue,
    replaceQueueWithWeatherTracks,
  };
}
