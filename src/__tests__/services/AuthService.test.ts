import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../services/AuthService";

vi.mock("../../lib/core/crypto.utils", () => ({
  generateRandomString: vi.fn().mockReturnValue("test_code_verifier"),
  generateCodeChallenge: vi.fn().mockResolvedValue("test_code_challenge"),
}));

global.fetch = vi.fn();

const TOKEN_STORAGE_KEY = "spotify_auth_tokens";
const CODE_VERIFIER_KEY = "spotify_code_verifier";

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

  it("calls localStorage.setItem with the code verifier during login", async () => {
    await authService.startLogin();
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      CODE_VERIFIER_KEY,
      expect.any(String),
    );
  });

  it("stores and retrieves tokens correctly", () => {
    const tokens = {
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 10000,
    };
    setTokens(tokens);
    expect(authService["getTokens"]()).toEqual(tokens);
  });

  it("returns false for isAuthenticated if no tokens", () => {
    expect(authService.isAuthenticated()).toBe(false);
  });

  it("returns false for isAuthenticated if token expired", () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() - 1000,
    });
    expect(authService.isAuthenticated()).toBe(false);
  });

  it("returns true for isAuthenticated if token valid", () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 10000,
    });
    expect(authService.isAuthenticated()).toBe(true);
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

  it("getAccessToken returns access token if valid", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 120000,
    });
    await expect(authService.getAccessToken()).resolves.toBe("a");
  });

  it("getAccessToken throws if no tokens", async () => {
    await expect(authService.getAccessToken()).rejects.toThrow(
      "Not authenticated",
    );
  });

  it("getAccessToken tries to refresh if expired", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() - 1000,
    });
    // @ts-expect-error: Testing error conditions
    vi.spyOn(authService, "refreshTokens").mockResolvedValue({
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
    // @ts-expect-error: Testing error conditions
    vi.spyOn(authService, "refreshTokens").mockRejectedValue(new Error("fail"));
    await expect(authService.getAccessToken()).rejects.toThrow(
      "Failed to refresh access token",
    );
  });

  it("getAccessTokenSafe returns null if no tokens", async () => {
    await expect(authService.getAccessTokenSafe()).resolves.toBeNull();
  });

  it("getAccessTokenSafe returns accessToken if valid", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() + 120000,
    });
    await expect(authService.getAccessTokenSafe()).resolves.toBe("a");
  });

  it("getAccessTokenSafe refreshes if expired", async () => {
    setTokens({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now() - 1000,
    });
    // @ts-expect-error: Testing error conditions
    vi.spyOn(authService, "refreshToken").mockResolvedValue("new");
    await expect(authService.getAccessTokenSafe()).resolves.toBe("new");
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

  it("exchangeCodeForToken throws on error", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error_description: "fail" }),
    });
    await expect(authService.exchangeCodeForToken("c", "v")).rejects.toThrow(
      "fail",
    );
  });

  it("handleCallback throws if no code verifier", async () => {
    window.localStorage.removeItem(CODE_VERIFIER_KEY);
    await expect(
      authService.handleCallback({ code: "c", state: "s" }),
    ).rejects.toThrow("No code verifier found");
  });

  it("handleCallback calls exchangeCodeForToken", async () => {
    window.localStorage.setItem(CODE_VERIFIER_KEY, "ver");
    vi.spyOn(authService, "exchangeCodeForToken").mockResolvedValue({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: Date.now(),
    });
    await authService.handleCallback({ code: "c", state: "s" });
    expect(authService.exchangeCodeForToken).toHaveBeenCalledWith("c", "ver");
  });

  it("handleCallbackFromUrl throws if error param", async () => {
    const orig = window.location.search;
    Object.defineProperty(window, "location", {
      value: { search: "?error=fail" },
      writable: true,
    });
    await expect(authService.handleCallbackFromUrl()).rejects.toThrow(
      "Spotify auth error: fail",
    );
    Object.defineProperty(window, "location", {
      value: { search: orig },
      writable: true,
    });
  });

  it("handleCallbackFromUrl throws if missing code or state", async () => {
    const orig = window.location.search;
    Object.defineProperty(window, "location", {
      value: { search: "?code=abc" },
      writable: true,
    });
    await expect(authService.handleCallbackFromUrl()).rejects.toThrow(
      "Missing required authentication parameters",
    );
    Object.defineProperty(window, "location", {
      value: { search: orig },
      writable: true,
    });
  });

  it("handleCallbackFromUrl calls handleCallback", async () => {
    const orig = window.location.search;
    Object.defineProperty(window, "location", {
      value: { search: "?code=c&state=s" },
      writable: true,
    });
    vi.spyOn(authService, "handleCallback").mockResolvedValue();
    await authService.handleCallbackFromUrl();
    expect(authService.handleCallback).toHaveBeenCalledWith({
      code: "c",
      state: "s",
    });
    Object.defineProperty(window, "location", {
      value: { search: orig },
      writable: true,
    });
  });
});
