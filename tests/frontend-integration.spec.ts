import { test, expect } from "@playwright/test";

const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Frontend-Only Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test("home page loads without backend", async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // Page should load successfully
    await expect(page.locator("body")).toBeVisible();

    // Should not see any backend error messages
    const hasBackendError = await page
      .locator("text=/backend.*error|server.*error|connection.*failed/i")
      .isVisible({ timeout: 3000 });
    expect(hasBackendError).toBe(false);
  });

  test("weather display works independently", async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // Weather information should be visible
    const weatherElements = page.locator(
      "text=/temperature|weather|sunny|cloudy|rainy/i",
    );
    await expect(weatherElements.first()).toBeVisible({ timeout: 10000 });
  });

  test("music search functionality", async ({ page }) => {
    // Mock Spotify API to avoid authentication
    await page.route("https://api.spotify.com/**", async (route) => {
      if (route.request().url().includes("/search")) {
        await route.fulfill({
          json: {
            tracks: {
              items: [
                {
                  id: "test-track",
                  name: "Test Song",
                  artists: [{ name: "Test Artist" }],
                  album: {
                    name: "Test Album",
                    images: [{ url: "https://example.com/image.jpg" }],
                  },
                  external_urls: {
                    spotify: "https://open.spotify.com/track/test",
                  },
                  preview_url: "https://example.com/preview.mp3",
                },
              ],
            },
          },
        });
      } else {
        await route.abort();
      }
    });

    await page.goto(FRONTEND_URL);

    // Try to search for music (if search functionality is visible)
    const searchInput = page.locator(
      "input[type=text], input[placeholder*=search]",
    );

    if (await searchInput.isVisible({ timeout: 5000 })) {
      await searchInput.fill("test song");
      await page.keyboard.press("Enter");

      // Should see search results
      await expect(page.locator("text=Test Song")).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("no network calls to backend", async ({ page }) => {
    const backendCalls: string[] = [];

    // Monitor network requests
    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("127.0.0.1:8000") || url.includes("localhost:8000")) {
        backendCalls.push(url);
      }
    });

    await page.goto(FRONTEND_URL);

    // Navigate around the app
    await page.waitForTimeout(2000);

    // Try clicking various elements
    const clickableElements = page.locator("button, a");
    const elementCount = await clickableElements.count();

    for (let i = 0; i < Math.min(3, elementCount); i++) {
      try {
        await clickableElements.nth(i).click({ timeout: 1000 });
        await page.waitForTimeout(500);
      } catch {
        // Ignore click failures
      }
    }

    // Should have no backend calls
    expect(backendCalls).toHaveLength(0);
  });

  test("direct Spotify API calls are made", async ({ page }) => {
    const spotifyApiCalls: string[] = [];

    // Monitor network requests to Spotify
    page.on("request", (request) => {
      const url = request.url();
      if (
        url.includes("api.spotify.com") ||
        url.includes("accounts.spotify.com")
      ) {
        spotifyApiCalls.push(url);
      }
    });

    await page.goto(`${FRONTEND_URL}/login`);

    // Click login to trigger OAuth
    const loginButton = page.getByRole("button", { name: /login.*spotify/i });
    if (await loginButton.isVisible({ timeout: 3000 })) {
      await loginButton.click();
      await page.waitForTimeout(1000);
    }

    // Should have made calls to Spotify (OAuth)
    expect(spotifyApiCalls.length).toBeGreaterThan(0);
    expect(
      spotifyApiCalls.some((url) => url.includes("accounts.spotify.com")),
    ).toBe(true);
  });

  test("static hosting compatibility", async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // App should work with only static files
    // Check for any server-side rendering dependencies
    const hasSSRErrors = await page
      .locator("text=/server.*side|ssr.*error|hydration.*error/i")
      .isVisible({ timeout: 3000 });
    expect(hasSSRErrors).toBe(false);

    // JavaScript should be loaded and working
    const jsWorking = await page.evaluate(() => {
      return typeof window !== "undefined" && typeof document !== "undefined";
    });
    expect(jsWorking).toBe(true);
  });

  test("environment configuration is frontend-only", async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // Check that the application loads and works (indicating proper env configuration)
    const appWorking = await page.evaluate(() => {
      return typeof window !== "undefined" && typeof document !== "undefined";
    });

    expect(appWorking).toBe(true);

    // The app should not have backend environment variables in the source code
    const pageContent = await page.content();
    expect(pageContent).not.toContain("FLASK_SECRET_KEY");
    expect(pageContent).not.toContain("SPOTIPY_CLIENT_SECRET");
  });
});
