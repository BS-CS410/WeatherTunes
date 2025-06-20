/**
 * Unified track data types for the queue system
 */

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  albumArtFallback?: string;
  tags?: string[];
}

export interface QueueResponse {
  queue: TrackMetadata[];
  message?: string;
}

export interface NextTrackResponse {
  next_track: TrackMetadata | null; // Changed from next_track_id: string | null
  queue: TrackMetadata[];
  message?: string;
}

export interface AddTrackResponse {
  message: string;
  queue: TrackMetadata[];
}

export interface ClearQueueResponse {
  message: string;
  queue: TrackMetadata[]; // Technically, the queue will be empty, but type consistency is good
}

export interface ReplaceQueueResponse {
  message: string;
  queue: TrackMetadata[];
}
