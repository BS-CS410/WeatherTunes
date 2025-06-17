## Queue System Implementation Summary

This document outlines the implementation of the user-specific song queue system.

### 1. Backend API (`backend/app/routes/queue.py`)

- **New Flask Routes:** Created to manage song queues:
  - `GET /queue`: Retrieve the current user's queue.
  - `POST /queue/add`: Add a track (by `track_id`) to the queue.
  - `POST /queue/next`: Get the next track ID, remove it from the queue, and return the ID and updated queue.
  - `POST /queue/clear`: Clear the user's entire queue.
  - `POST /queue/replace`: Replace the user's queue with a new list of track IDs.
- **Storage:** Implemented user-specific, in-memory queue storage.
  - Each logged-in user has a distinct queue.
  - Queues reset if the backend server restarts.
- **Authentication:** All queue operations are authenticated, linking actions to the specific logged-in user.
- **Registration:** The new `queue_bp` blueprint was registered in the main Flask application (`backend/run.py`).

### 2. Frontend Hook (`src/hooks/useCurrentTrack.ts`)

- **Removed Frontend Placeholders:** The previous system of using a static list of placeholder songs in the frontend was removed.
- **API Client (`src/lib/apiClient.ts`):**
  - A new, basic API client utility was created to handle HTTP requests to the backend.
- **Integration with Backend:** The `useCurrentTrack` hook was significantly modified:
  - **Initial Queue Load:** Fetches the initial song queue (as a list of track IDs) from the backend's `GET /queue` endpoint when the application loads (or the hook mounts).
  - **Metadata Enrichment:** Converts the fetched track IDs into full `TrackMetadata` objects (title, artist, album art, etc.) by calling `getSpotifyTrackMetadata` for each ID. These full objects are then stored in the local `songQueue` state.
  - **API-Driven Actions:** Functions like `setNextTrack`, `addTrackToQueue`, and newly added functions (`replaceQueueWithTracks`, `clearQueue`) were updated to make API calls to the corresponding backend endpoints.
  - **State Synchronization:** The local `songQueue` state in the frontend is now a reflection of the queue managed and persisted (in memory) by the backend.

### Summary of Flow

The queue logic has transitioned from a purely frontend-based placeholder system to a client-server model. The backend now serves as the authority for managing the list of track IDs in a user's queue. The frontend fetches this list, enriches it with detailed song metadata for display purposes, and uses the backend API for all modifications to the queue.
