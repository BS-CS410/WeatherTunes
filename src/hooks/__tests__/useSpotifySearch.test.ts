import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpotifySearch } from "../useSpotifySearch";
import { SpotifyApiService } from "@/lib/spotifyApiService";
import { useAuth } from "../useAuth";
import type { TrackMetadata } from "@/types/queue";

// Mock dependencies
vi.mock("@/lib/spotifyApiService", () => ({
  SpotifyApiService: {
    searchTracks: vi.fn(),
    getWeatherRecommendations: vi.fn(),
  },
}));

vi.mock("../useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockSpotifyApiService = vi.mocked(SpotifyApiService);
const mockUseAuth = vi.mocked(useAuth);

const mockSearchResults: TrackMetadata[] = [
  {
    id: "track1",
    title: "Test Song 1",
    artist: "Test Artist 1",
    albumArt: "https://example.com/image1.jpg",
  },
  {
    id: "track2",
    title: "Test Song 2",
    artist: "Test Artist 2",
    albumArt: "https://example.com/image2.jpg",
  },
];

describe("useSpotifySearch", () => {
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

    // Default successful search response
    mockSpotifyApiService.searchTracks.mockResolvedValue(mockSearchResults);
    mockSpotifyApiService.getWeatherRecommendations.mockResolvedValue(
      mockSearchResults,
    );
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useSpotifySearch());

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.searchError).toBeNull();
    expect(typeof result.current.searchTracks).toBe("function");
    expect(typeof result.current.searchByMood).toBe("function");
    expect(typeof result.current.clearSearchResults).toBe("function");
  });

  it("should search tracks successfully", async () => {
    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("test query");
    });

    expect(mockSpotifyApiService.searchTracks).toHaveBeenCalledWith(
      "test query",
      10,
    );
    expect(result.current.searchResults).toEqual(mockSearchResults);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.searchError).toBeNull();
  });

  it("should search tracks with custom limit", async () => {
    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("test query", 20);
    });

    expect(mockSpotifyApiService.searchTracks).toHaveBeenCalledWith(
      "test query",
      20,
    );
  });

  it("should set loading state during search", async () => {
    let resolveSearch: (value: TrackMetadata[]) => void;
    const searchPromise = new Promise<TrackMetadata[]>((resolve) => {
      resolveSearch = resolve;
    });

    mockSpotifyApiService.searchTracks.mockReturnValue(searchPromise);

    const { result } = renderHook(() => useSpotifySearch());

    // Start search
    act(() => {
      result.current.searchTracks("test query");
    });

    // Should be loading
    expect(result.current.isSearching).toBe(true);

    // Complete search
    await act(async () => {
      resolveSearch!(mockSearchResults);
      await searchPromise;
    });

    expect(result.current.isSearching).toBe(false);
  });

  it("should handle search errors", async () => {
    const errorMessage = "Search failed";
    mockSpotifyApiService.searchTracks.mockRejectedValue(
      new Error(errorMessage),
    );

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("test query");
    });

    expect(result.current.searchError).toBe(errorMessage);
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it("should not search when user is not authenticated", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("test query");
    });

    expect(mockSpotifyApiService.searchTracks).not.toHaveBeenCalled();
    expect(result.current.searchError).toBe(
      "Please log in to search for tracks",
    );
  });

  it("should not search with empty query", async () => {
    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("   ");
    });

    expect(mockSpotifyApiService.searchTracks).not.toHaveBeenCalled();
    expect(result.current.searchError).toBe("Please enter a search query");
  });

  it("should handle empty search results", async () => {
    mockSpotifyApiService.searchTracks.mockResolvedValue([]);

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("test query");
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchError).toBe("No tracks found for your search");
  });

  it("should search by mood successfully", async () => {
    mockSpotifyApiService.searchTracks.mockResolvedValue(mockSearchResults);

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchByMood("happy");
    });

    expect(mockSpotifyApiService.searchTracks).toHaveBeenCalledWith(
      "mood:happy",
      10,
    );
    expect(result.current.searchResults).toEqual(mockSearchResults);
    expect(result.current.searchError).toBeNull();
  });

  it("should search by mood with custom limit", async () => {
    mockSpotifyApiService.searchTracks.mockResolvedValue(mockSearchResults);

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchByMood("happy", 15);
    });

    expect(mockSpotifyApiService.searchTracks).toHaveBeenCalledWith(
      "mood:happy",
      15,
    );
  });

  it("should handle mood search when user is not authenticated", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchByMood("happy");
    });

    expect(mockSpotifyApiService.searchTracks).not.toHaveBeenCalled();
    expect(result.current.searchError).toBe(
      "Please log in to search for tracks",
    );
  });

  it("should handle mood search with empty mood", async () => {
    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchByMood("   ");
    });

    expect(mockSpotifyApiService.searchTracks).toHaveBeenCalledWith(
      "mood:   ",
      10,
    );
    expect(result.current.searchError).toBeNull(); // Empty mood still gets processed
  });

  it("should handle mood search errors", async () => {
    const errorMessage = "Mood search failed";
    mockSpotifyApiService.searchTracks.mockRejectedValue(
      new Error(errorMessage),
    );

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchByMood("happy");
    });

    expect(result.current.searchError).toBe(errorMessage);
    expect(result.current.searchResults).toEqual([]);
  });

  it("should handle empty mood search results", async () => {
    mockSpotifyApiService.searchTracks.mockResolvedValue([]);

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchByMood("happy");
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchError).toBe("No tracks found for mood: happy");
  });

  it("should clear search results", () => {
    const { result } = renderHook(() => useSpotifySearch());

    act(() => {
      result.current.clearSearchResults();
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchError).toBeNull();
  });

  it("should clear previous errors when starting new search", async () => {
    const { result } = renderHook(() => useSpotifySearch());

    // First search that fails
    mockSpotifyApiService.searchTracks.mockRejectedValueOnce(
      new Error("First error"),
    );
    await act(async () => {
      await result.current.searchTracks("query1");
    });

    expect(result.current.searchError).toBe("First error");

    // Second search that succeeds
    mockSpotifyApiService.searchTracks.mockResolvedValueOnce(mockSearchResults);
    await act(async () => {
      await result.current.searchTracks("query2");
    });

    expect(result.current.searchError).toBeNull();
    expect(result.current.searchResults).toEqual(mockSearchResults);
  });

  it("should handle non-Error exceptions", async () => {
    mockSpotifyApiService.searchTracks.mockRejectedValue("String error");

    const { result } = renderHook(() => useSpotifySearch());

    await act(async () => {
      await result.current.searchTracks("test query");
    });

    expect(result.current.searchError).toBe(
      "Failed to search tracks. Please try again.",
    );
  });
});
