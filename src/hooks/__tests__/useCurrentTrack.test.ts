import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCurrentTrack } from "../useCurrentTrack";
import { apiClient } from "@/lib";
import { SpotifyApiService } from "@/lib/spotifyApiService";
import { useAuth } from "../utility";
import type { TrackMetadata } from "@/types/queue";

// Mock dependencies
vi.mock("@/lib", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/spotifyApiService", () => ({
  SpotifyApiService: {
    getTrackById: vi.fn(),
    getTracksByIds: vi.fn(),
  },
}));

vi.mock("../utility", () => ({
  useAuth: vi.fn(),
}));

const mockApiClient = vi.mocked(apiClient);
const mockSpotifyApiService = vi.mocked(SpotifyApiService);
const mockUseAuth = vi.mocked(useAuth);

const mockTrackMetadata: TrackMetadata = {
  id: "track123",
  title: "Test Song",
  artist: "Test Artist",
  albumArt: "https://example.com/image.jpg",
};

const mockQueueResponse = {
  queue: [
    mockTrackMetadata,
    {
      id: "track456",
      title: "Next Song",
      artist: "Next Artist",
      albumArt: "https://example.com/image2.jpg",
    },
  ],
};

const createMockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: new Headers(),
});

describe("useCurrentTrack", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default auth state - authenticated user
    mockUseAuth.mockReturnValue({
      user: { username: "testuser", isAuthenticated: true },
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    // Default API responses
    mockApiClient.get.mockResolvedValue(
      createMockApiResponse(mockQueueResponse),
    );
    mockSpotifyApiService.getTrackById.mockResolvedValue(mockTrackMetadata);
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useCurrentTrack());

    expect(result.current.trackMetadata).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.currentTrackId).toBeNull();
    expect(result.current.songQueue).toEqual([]);
  });

  it("should fetch queue on mount when user is authenticated", async () => {
    renderHook(() => useCurrentTrack());

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "http://localhost:8000/queue",
      );
    });
  });

  it("should not fetch queue when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    renderHook(() => useCurrentTrack());

    expect(mockApiClient.get).not.toHaveBeenCalled();
  });

  it("should update track metadata when updateTrack is called", async () => {
    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.updateTrack("track123");
    });

    await waitFor(() => {
      expect(result.current.trackMetadata).toEqual(mockTrackMetadata);
      expect(result.current.currentTrackId).toBe("track123");
    });

    expect(mockSpotifyApiService.getTrackById).toHaveBeenCalledWith("track123");
  });

  it("should not refetch track if same track is already loaded", async () => {
    const { result } = renderHook(() => useCurrentTrack());

    // First call
    await act(async () => {
      await result.current.updateTrack("track123");
    });

    vi.clearAllMocks();

    // Second call with same track
    await act(async () => {
      await result.current.updateTrack("track123");
    });

    expect(mockSpotifyApiService.getTrackById).not.toHaveBeenCalled();
  });

  it("should handle Spotify API failure gracefully", async () => {
    mockSpotifyApiService.getTrackById.mockResolvedValue(null);

    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.updateTrack("track123");
    });

    await waitFor(() => {
      expect(result.current.trackMetadata).toEqual({
        id: "track123",
        title: "Unknown Track",
        artist: "Unknown Artist",
        albumArt: "",
      });
    });
  });

  it("should clear track metadata when updateTrack called with empty string", async () => {
    const { result } = renderHook(() => useCurrentTrack());

    // First set a track
    await act(async () => {
      await result.current.updateTrack("track123");
    });

    // Then clear it
    await act(async () => {
      await result.current.updateTrack("");
    });

    expect(result.current.trackMetadata).toBeNull();
    expect(result.current.currentTrackId).toBeNull();
  });

  it("should add track to queue", async () => {
    mockApiClient.post.mockResolvedValue(
      createMockApiResponse({ success: true, message: "Track added to queue" }),
    );

    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.addTrackToQueue("track123");
    });

    expect(mockApiClient.post).toHaveBeenCalledWith(
      "http://localhost:8000/queue/add",
      {
        track: {
          id: "track123",
          title: "Test Song",
          artist: "Test Artist",
          albumArt: "https://example.com/image.jpg",
        },
      },
    );
  });

  it("should replace queue with new tracks", async () => {
    const mockTracks = [
      {
        id: "track1",
        title: "Track 1",
        artist: "Artist 1",
        albumArt: "art1.jpg",
      },
      {
        id: "track2",
        title: "Track 2",
        artist: "Artist 2",
        albumArt: "art2.jpg",
      },
    ];

    mockSpotifyApiService.getTracksByIds.mockResolvedValue(mockTracks);
    mockApiClient.post.mockResolvedValue(
      createMockApiResponse({ success: true, message: "Queue replaced" }),
    );

    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.replaceQueueWithTracks(["track1", "track2"]);
    });

    expect(mockSpotifyApiService.getTracksByIds).toHaveBeenCalledWith([
      "track1",
      "track2",
    ]);
    expect(mockApiClient.post).toHaveBeenCalledWith(
      "http://localhost:8000/queue/replace",
      { tracks: mockTracks },
    );
  });

  it("should clear queue", async () => {
    mockApiClient.post.mockResolvedValue(
      createMockApiResponse({ success: true, message: "Queue cleared" }),
    );

    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.clearQueue();
    });

    expect(mockApiClient.post).toHaveBeenCalledWith(
      "http://localhost:8000/queue/clear",
      {},
    );
  });

  it("should set next track from queue", async () => {
    mockApiClient.post.mockResolvedValue(
      createMockApiResponse({ success: true, currentTrack: mockTrackMetadata }),
    );

    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.setNextTrack();
    });

    expect(mockApiClient.post).toHaveBeenCalledWith(
      "http://localhost:8000/queue/next",
      {},
    );
  });

  it("should handle queue fetch failure", async () => {
    mockApiClient.get.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCurrentTrack());

    await waitFor(() => {
      expect(result.current.songQueue).toEqual([]);
    });
  });

  it("should handle queue operations when user is not authenticated", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentTrack());

    await act(async () => {
      await result.current.addTrackToQueue("track123");
    });

    expect(mockApiClient.post).not.toHaveBeenCalled();
  });

  it("should update queue state when operations succeed", async () => {
    // Use the same queue as mockQueueResponse for consistency
    const updatedQueue = [
      {
        id: "track123",
        title: "Test Song",
        artist: "Test Artist",
        albumArt: "https://example.com/image.jpg",
      },
      {
        id: "track456",
        title: "Next Song",
        artist: "Next Artist",
        albumArt: "https://example.com/image2.jpg",
      },
    ];

    mockApiClient.post.mockResolvedValue(
      createMockApiResponse({ success: true, queue: updatedQueue }),
    );

    const { result } = renderHook(() => useCurrentTrack());

    // Wait for initial queue fetch
    await waitFor(() => {
      expect(result.current.songQueue).toEqual(mockQueueResponse.queue);
    });

    // Add track to queue
    await act(async () => {
      await result.current.addTrackToQueue("track123");
    });

    // Should update queue from response
    await waitFor(() => {
      expect(result.current.songQueue).toEqual(updatedQueue);
    });
  });
});
