import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../services/AuthService";

// Mock utilities and global fetch
vi.mock("../../lib/core/crypto.utils", () => ({
  generateRandomString: vi
    .fn()
    .mockReturnValueOnce("test_code_verifier")
    .mockReturnValueOnce("test_state"),
  generateCodeChallenge: vi.fn().mockResolvedValue("test_code_challenge"),
  generateCodeVerifier: vi.fn().mockReturnValue("test_code_verifier"),
  generateSecureRandomString: vi.fn().mockReturnValue("test_state"),
}));

global.fetch = vi.fn();

const TOKEN_STORAGE_KEY = "spotify_tokens";
const CODE_VERIFIER_KEY = "spotify_code_verifier";
const STATE_KEY = "spotify_auth_state";

function setTokens(tokens: Record<string, unknown>) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    if (mockFetch.mockReset) {
      mockFetch.mockReset();
    }
    authService = new AuthService();
  });

  it("initiateLogin calls localStorage.setItem with the code verifier and state", async () => {
    // Mock window.location.href to prevent navigation
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
    await authService.initiateLogin();
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      CODE_VERIFIER_KEY,
      "test_code_verifier",
    );
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      STATE_KEY,
      "test_state",
    );
  });

  it("stores and retrieves tokens correctly", () => {
    const tokens = {
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 10000,
    };
    setTokens(tokens);
    // @ts-expect-error testing private method
    expect(authService.getTokens()).toEqual(tokens);
  });

  it("returns false for isAuthenticated if no tokens", async () => {
    await expect(authService.isAuthenticated()).resolves.toBe(false);
  });

  it("returns false for isAuthenticated if token expired and refresh fails", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() - 1000,
    });
    // @ts-expect-error testing private method
    vi.spyOn(authService, "refreshAccessToken").mockRejectedValue(
      new Error("Refresh failed"),
    );
    await expect(authService.isAuthenticated()).resolves.toBe(false);
  });

  it("returns true for isAuthenticated if token is valid", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 3600 * 1000, // 1 hour
    });
    await expect(authService.isAuthenticated()).resolves.toBe(true);
  });

  it("logout clears tokens", () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 10000,
    });
    window.localStorage.setItem(CODE_VERIFIER_KEY, "foo");
    authService.logout();
    expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
  });

  it("getAccessToken throws if no tokens", async () => {
    await expect(authService.getAccessToken()).rejects.toThrow(
      "Not authenticated",
    );
  });

  it("getAccessToken returns accessToken if valid", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 120000,
    });
    await expect(authService.getAccessToken()).resolves.toBe("a");
  });

  it("getAccessToken refreshes if expired", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() - 1000,
    });
    // @ts-expect-error: Testing private method
    vi.spyOn(authService, "refreshAccessToken").mockResolvedValue({
      accessToken: "new",
      refreshToken: "r",
      expiresAt: Date.now() + 10000,
    });
    await expect(authService.getAccessToken()).resolves.toBe("new");
  });

  it("getAccessToken throws if refresh fails", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() - 1000,
    });
    // @ts-expect-error: Testing private method
    vi.spyOn(authService, "refreshAccessToken").mockRejectedValue(
      new Error("fail"),
    );
    await expect(authService.getAccessToken()).rejects.toThrow("fail");
  });

  it("exchangeCodeForToken stores tokens and removes code verifier on success", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "a",
        refresh_token: "r",
        expires_in: 60,
      }),
    });
    window.localStorage.setItem(CODE_VERIFIER_KEY, "ver");
    await authService.exchangeCodeForToken("code", "ver");
    expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).not.toBeNull();
    expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
  });

  it("exchangeCodeForToken clears all auth storage keys on error", async () => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, "should_clear");
    window.localStorage.setItem(CODE_VERIFIER_KEY, "should_clear");
    window.localStorage.setItem(STATE_KEY, "should_clear");
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error_description: "fail" }),
    });
    await expect(authService.exchangeCodeForToken("c", "v")).rejects.toThrow(
      "fail",
    );
    expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
    expect(window.localStorage.getItem(STATE_KEY)).toBeNull();
  });

  describe("handleRedirectCallback", () => {
    beforeEach(() => {
      Object.defineProperty(window, "location", {
        value: { search: "" },
        writable: true,
      });
      localStorage.setItem(STATE_KEY, "test_state");
      localStorage.setItem(CODE_VERIFIER_KEY, "test_verifier");
      localStorage.setItem(TOKEN_STORAGE_KEY, "test_token");
    });

    it("clears all auth storage keys if error param is present", async () => {
      window.location.search = "?error=access_denied";
      await expect(authService.handleRedirectCallback()).rejects.toThrow(
        "Spotify auth error: access_denied",
      );
      expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
      expect(window.localStorage.getItem(STATE_KEY)).toBeNull();
    });

    it("clears all auth storage keys if state does not match", async () => {
      window.location.search = "?code=test_code&state=wrong_state";
      await expect(authService.handleRedirectCallback()).rejects.toThrow(
        "State mismatch error. Potential CSRF attack.",
      );
      expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
      expect(window.localStorage.getItem(STATE_KEY)).toBeNull();
    });

    it("clears all auth storage keys if code is missing", async () => {
      window.location.search = "?state=test_state";
      await expect(authService.handleRedirectCallback()).rejects.toThrow(
        "Missing required 'code' authentication parameter.",
      );
      expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
      expect(window.localStorage.getItem(STATE_KEY)).toBeNull();
    });

    it("clears all auth storage keys if code verifier is missing", async () => {
      window.location.search = "?code=test_code&state=test_state";
      localStorage.removeItem(CODE_VERIFIER_KEY);
      await expect(authService.handleRedirectCallback()).rejects.toThrow(
        "No code verifier found in local storage.",
      );
      expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(window.localStorage.getItem(CODE_VERIFIER_KEY)).toBeNull();
      expect(window.localStorage.getItem(STATE_KEY)).toBeNull();
    });

    it("calls exchangeCodeForToken on success", async () => {
      window.location.search = "?code=test_code&state=test_state";
      const exchangeSpy = vi
        .spyOn(authService, "exchangeCodeForToken")
        .mockResolvedValue({
          accessToken: "a",
          refreshToken: "r",
          expiresAt: Date.now(),
        });

      await authService.handleRedirectCallback();

      expect(exchangeSpy).toHaveBeenCalledWith("test_code", "test_verifier");
    });
  });
});
