/**
 * Unified track data types for the queue system
 */

export interface TrackMetadata {
  id: string | null;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  albumArtFallback?: string;
  duration: number;
  previewUrl?: string;
  externalUrl: string;
  uri: string;
  tags?: string[];

  /**
   * URL to a video asset that matches the track's mood/weather
   */
  videoUrl?: string;

  /**
   * CSS class name for additional styling of the video
   */
  videoClass?: string;
}

import { ApiResponse } from '.';

export type QueueResponse = ApiResponse<{ queue: TrackMetadata[] }>;

export type NextTrackResponse = ApiResponse<{
  nextTrack: TrackMetadata | null;
  queue: TrackMetadata[];
}>;

export type AddTrackResponse = ApiResponse<{ queue: TrackMetadata[] }>;

export type ClearQueueResponse = ApiResponse<{ queue: TrackMetadata[] }>;

export type ReplaceQueueResponse = ApiResponse<{ queue: TrackMetadata[] }>;
