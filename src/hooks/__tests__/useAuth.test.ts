import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../hooks-utility";
import { authService, type AuthState } from "@/lib/spotify-client";

// Mock the auth service
vi.mock("@/lib/auth-frontend", () => ({
  authService: {
    getState: vi.fn(),
    subscribe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
  },
}));

const mockAuthService = vi.mocked(authService);

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock state
    mockAuthService.getState.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
    });

    // Mock subscribe to return an unsubscribe function
    mockAuthService.subscribe.mockReturnValue(vi.fn());
  });

  it("should return initial auth state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.logout).toBe("function");
    expect(typeof result.current.checkAuth).toBe("function");
  });

  it("should subscribe to auth state changes", () => {
    renderHook(() => useAuth());

    expect(mockAuthService.subscribe).toHaveBeenCalledTimes(1);
    expect(mockAuthService.subscribe).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  it("should update state when auth service state changes", () => {
    let stateChangeCallback: ((state: AuthState) => void) | undefined;

    mockAuthService.subscribe.mockImplementation((callback) => {
      stateChangeCallback = callback;
      return vi.fn();
    });

    const { result } = renderHook(() => useAuth());

    // Initial state
    expect(result.current.user).toBeNull();

    // Simulate auth state change
    const newState: AuthState = {
      user: { username: "testuser", isAuthenticated: true as const },
      isLoading: false,
      error: null,
    };

    act(() => {
      stateChangeCallback?.(newState);
    });

    expect(result.current.user).toEqual(newState.user);
  });

  it("should handle authenticated user state", () => {
    mockAuthService.getState.mockReturnValue({
      user: { username: "testuser", isAuthenticated: true },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({
      username: "testuser",
      isAuthenticated: true,
    });
  });

  it("should handle loading state", () => {
    mockAuthService.getState.mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle error state", () => {
    const errorMessage = "Authentication failed";
    mockAuthService.getState.mockReturnValue({
      user: null,
      isLoading: false,
      error: errorMessage,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.error).toBe(errorMessage);
  });

  it("should call login when login is invoked", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      result.current.login();
    });

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
  });

  it("should call logout when logout is invoked", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      result.current.logout();
    });

    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
  });

  it("should call checkAuth when checkAuth is invoked", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      result.current.checkAuth();
    });

    expect(mockAuthService.checkAuth).toHaveBeenCalledTimes(1);
  });

  it("should clean up subscription on unmount", () => {
    const unsubscribeMock = vi.fn();
    mockAuthService.subscribe.mockReturnValue(unsubscribeMock);

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
