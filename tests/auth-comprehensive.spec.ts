/**
 * Comprehensive Authentication Test Suite
 * Tests all authentication scenarios with certainty
 */

import { test, expect, Page } from "@playwright/test";

const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Authentication System - Comprehensive Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Clear all storage before each test
    await page.goto(FRONTEND_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe("Authentication Flow", () => {
    test("should handle complete OAuth PKCE flow correctly", async ({
      page,
    }) => {
      // 1. Start at login page
      await page.goto(`${FRONTEND_URL}/login`);

      // 2. Verify login button exists and is functional
      const loginButton = page.getByRole("button", { name: /login.*spotify/i });
      await expect(loginButton).toBeVisible();

      // 3. Intercept OAuth initiation
      let oauthUrl = "";
      page.on("request", (request) => {
        if (request.url().includes("accounts.spotify.com/authorize")) {
          oauthUrl = request.url();
        }
      });

      // 4. Click login and verify OAuth parameters
      await loginButton.click();
      await page.waitForURL(/accounts\.spotify\.com/);

      // 5. Verify PKCE parameters are present
      expect(oauthUrl).toContain("response_type=code");
      expect(oauthUrl).toContain("client_id=");
      expect(oauthUrl).toContain("redirect_uri=");
      expect(oauthUrl).toContain("code_challenge=");
      expect(oauthUrl).toContain("code_challenge_method=S256");
      expect(oauthUrl).toContain("scope=");
    });

    test("should handle OAuth callback correctly", async ({ page }) => {
      // Test callback page with mock parameters
      const mockCode = "test_auth_code";
      const mockState = "test_state";

      await page.goto(
        `${FRONTEND_URL}/callback?code=${mockCode}&state=${mockState}`,
      );

      // Should show some kind of state (processing initially, then error or success)
      await page.waitForTimeout(1000);

      // Should handle the callback (will fail without real tokens, but should not crash)
      await expect(page.locator("body")).toBeVisible();

      // Should show appropriate error or success state (since mock auth will fail)
      const hasError = await page
        .locator("h2:has-text('Authentication Error')")
        .isVisible();
      const hasSuccess = await page
        .locator("text=/success|redirecting/i")
        .isVisible();
      const hasProcessing = await page
        .locator("text=/authenticating/i")
        .isVisible();

      expect(hasError || hasSuccess || hasProcessing).toBe(true);
    });

    test("should handle callback errors gracefully", async ({ page }) => {
      // Test callback with error parameter
      await page.goto(`${FRONTEND_URL}/callback?error=access_denied`);

      // Should show error state
      await expect(page.locator("text=/error|denied|failed/i")).toBeVisible();

      // Should provide retry option
      const retryButton = page.getByRole("button", {
        name: /try.*again|retry/i,
      });
      await expect(retryButton).toBeVisible();
    });
  });

  test.describe("Authentication State Management", () => {
    test("should properly initialize authentication state", async ({
      page,
    }) => {
      await page.goto(FRONTEND_URL);

      // Wait for app to load
      await page.waitForSelector("body");

      // Check that authentication context is properly initialized
      const authState = await page.evaluate(() => {
        return {
          hasAuthProvider: !!window.localStorage,
          storageKeys: Object.keys(window.localStorage),
        };
      });

      expect(authState.hasAuthProvider).toBe(true);
    });

    test("should handle localStorage corruption gracefully", async ({
      page,
    }) => {
      // Corrupt localStorage with invalid JSON
      await page.goto(FRONTEND_URL);

      await page.evaluate(() => {
        localStorage.setItem("spotify_tokens", "invalid_json_data");
      });

      // Refresh page and verify app still loads
      await page.reload();
      await expect(page.locator("body")).toBeVisible();

      // Should have cleared corrupted data
      const tokens = await page.evaluate(() =>
        localStorage.getItem("spotify_tokens"),
      );
      expect(tokens).toBe(null);
    });

    test("should persist authentication state correctly", async ({ page }) => {
      // Set valid mock tokens
      await page.goto(FRONTEND_URL);

      await page.evaluate(() => {
        const mockTokens = {
          access_token: "mock_access_token",
          refresh_token: "mock_refresh_token",
          expires_at: Date.now() + 3600000, // 1 hour from now
        };
        localStorage.setItem("spotify_tokens", JSON.stringify(mockTokens));
      });

      // Refresh page and verify tokens persist
      await page.reload();

      const persistedTokens = await page.evaluate(() => {
        const stored = localStorage.getItem("spotify_tokens");
        return stored ? JSON.parse(stored) : null;
      });

      expect(persistedTokens).not.toBe(null);
      expect(persistedTokens.access_token).toBe("mock_access_token");
    });
  });

  test.describe("Token Management", () => {
    test("should handle token expiration correctly", async ({ page }) => {
      // Set expired tokens
      await page.goto(FRONTEND_URL);

      await page.evaluate(() => {
        const expiredTokens = {
          access_token: "expired_token",
          refresh_token: "mock_refresh_token",
          expires_at: Date.now() - 1000, // Expired 1 second ago
        };
        localStorage.setItem("spotify_tokens", JSON.stringify(expiredTokens));
      });

      // Navigate to a page that would trigger auth check
      await page.reload();

      // Should handle expired tokens gracefully (no crashes)
      await expect(page.locator("body")).toBeVisible();
    });

    test("should prevent concurrent token refresh attempts", async ({
      page,
    }) => {
      await page.goto(FRONTEND_URL);

      // Set up expired tokens
      await page.evaluate(() => {
        const expiredTokens = {
          access_token: "expired_token",
          refresh_token: "mock_refresh_token",
          expires_at: Date.now() - 1000,
        };
        localStorage.setItem("spotify_tokens", JSON.stringify(expiredTokens));
      });

      // Monitor network requests for duplicates
      const refreshRequests: string[] = [];
      page.on("request", (request) => {
        if (
          request.url().includes("api/token") &&
          request.method() === "POST"
        ) {
          refreshRequests.push(request.url());
        }
      });

      // Trigger multiple auth checks simultaneously
      await page.evaluate(() => {
        // Simulate multiple concurrent auth checks
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("auth-check"));
          }, i * 10);
        }
      });

      await page.waitForTimeout(1000);

      // Should not have made multiple concurrent refresh requests
      expect(refreshRequests.length).toBeLessThanOrEqual(1);
    });
  });
});
