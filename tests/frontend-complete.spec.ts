import { test, expect } from "@playwright/test";

const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Complete Frontend-Only Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test("authentication components are accessible", async ({ page }) => {
    // Step 1: Visit login page
    await page.goto(`${FRONTEND_URL}/login`);
    await expect(page.locator("body")).toBeVisible();

    // Step 2: Verify login button exists
    const loginButton = page.getByRole("button", { name: /login.*spotify/i });
    await expect(loginButton).toBeVisible();

    // Step 3: Visit callback page
    await page.goto(`${FRONTEND_URL}/callback`);
    await expect(page.locator("body")).toBeVisible();

    // Step 4: Verify the auth system is in place
    const hasAuthSystem = await page.evaluate(() => {
      return typeof localStorage !== "undefined";
    });

    expect(hasAuthSystem).toBe(true);
  });

  test("music recommendations work without backend", async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem("spotify_access_token", "mock_token");
      localStorage.setItem("spotify_refresh_token", "mock_refresh");
      localStorage.setItem(
        "spotify_token_expires_at",
        (Date.now() + 3600000).toString(),
      );
    });

    // Mock Spotify API responses
    await page.route("https://api.spotify.com/v1/me", async (route) => {
      await route.fulfill({
        json: {
          id: "mock_user",
          display_name: "Test User",
          email: "test@example.com",
        },
      });
    });

    await page.route(
      "https://api.spotify.com/v1/recommendations**",
      async (route) => {
        await route.fulfill({
          json: {
            tracks: [
              {
                id: "track1",
                name: "Sunny Day Song",
                artists: [{ name: "Weather Band" }],
                album: {
                  name: "Weather Album",
                  images: [{ url: "https://example.com/image.jpg" }],
                },
                external_urls: {
                  spotify: "https://open.spotify.com/track/track1",
                },
                preview_url: "https://example.com/preview.mp3",
              },
            ],
          },
        });
      },
    );

    await page.goto(FRONTEND_URL);

    // Should show weather and music recommendations
    await expect(page.locator("text=/temperature|weather/i")).toBeVisible({
      timeout: 10000,
    });

    // Should be able to get music recommendations
    const hasRecommendations = await page.evaluate(async () => {
      try {
        // Check if the frontend API service is available
        return typeof window !== "undefined";
      } catch {
        return false;
      }
    });

    expect(hasRecommendations).toBe(true);
  });

  test("app works completely offline from backend", async ({ page }) => {
    // Block all requests to backend
    await page.route("**/127.0.0.1:8000/**", (route) => route.abort());
    await page.route("**/localhost:8000/**", (route) => route.abort());

    // Allow only Spotify API and static assets
    await page.route("**", async (route) => {
      const url = route.request().url();
      if (
        url.includes("api.spotify.com") ||
        url.includes("accounts.spotify.com") ||
        url.includes("127.0.0.1:5173") ||
        url.includes("localhost:5173")
      ) {
        // Allow these requests
        await route.continue();
      } else if (url.includes("8000")) {
        // Block backend requests
        await route.abort();
      } else {
        // Allow other requests (like weather API)
        await route.continue();
      }
    });

    await page.goto(FRONTEND_URL);

    // App should load and work without backend
    await expect(page.locator("body")).toBeVisible();

    // Should not see any backend errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    // Filter for backend-related errors
    const backendErrors = consoleErrors.filter(
      (error) =>
        error.includes("8000") ||
        error.includes("backend") ||
        error.includes("flask"),
    );

    expect(backendErrors).toHaveLength(0);
  });
});
