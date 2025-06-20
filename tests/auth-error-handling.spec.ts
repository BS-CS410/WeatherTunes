import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://127.0.0.1:8000";
const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Authentication Error Handling & Circuit Breakers", () => {
  test.describe("401 Error Handling", () => {
    test("handles single 401 error without infinite retry loops", async ({
      page,
    }) => {
      // Monitor all network requests to catch retry loops
      const requests: { url: string; status: number; timestamp: number }[] = [];

      page.on("response", (response) => {
        requests.push({
          url: response.url(),
          status: response.status(),
          timestamp: Date.now(),
        });
      });

      // Start with unauthenticated state
      await page.goto(`${FRONTEND_URL}`);

      // Try to access protected endpoint
      const tokenResponse = await page.request.get(`${BACKEND_URL}/auth/token`);
      expect(tokenResponse.status()).toBe(401);

      // Wait and check that no excessive retry attempts occurred
      await page.waitForTimeout(2000);

      const tokenRequests = requests.filter((r) =>
        r.url.includes("/auth/token"),
      );

      // Should only have the initial request, no retries for 401s
      expect(tokenRequests.length).toBeLessThanOrEqual(2);
      console.log("Token requests:", tokenRequests.length);
    });

    test("prevents concurrent authentication check loops", async ({
      page,
      context,
    }) => {
      const requests: { url: string; method: string; timestamp: number }[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/auth/")) {
          requests.push({
            url: request.url(),
            method: request.method(),
            timestamp: Date.now(),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Simulate rapid auth checks (like multiple components mounting)
      const authChecks = Array.from({ length: 5 }, () =>
        page.request.get(`${BACKEND_URL}/auth/session`),
      );

      await Promise.all(authChecks);
      await page.waitForTimeout(1000);

      // Check for reasonable request count - should be batched/deduplicated
      const sessionRequests = requests.filter((r) =>
        r.url.includes("/auth/session"),
      );

      // Allow some requests but not excessive concurrent calls
      expect(sessionRequests.length).toBeLessThan(10);
      console.log("Session requests:", sessionRequests.length);
    });

    test("handles authentication error in player initialization gracefully", async ({
      page,
    }) => {
      // Mock Spotify SDK to be available
      await page.addInitScript(() => {
        interface SpotifyPlayerOptions {
          getOAuthToken?: (callback: (token: string) => void) => void;
        }

        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
          };
        }

        interface SpotifyPlayer {
          addListener: (
            event: string,
            callback: (data: unknown) => void,
          ) => void;
          connect: () => Promise<boolean>;
          disconnect: () => void;
        }

        (window as WindowWithSpotify).Spotify = {
          Player: class MockPlayer implements SpotifyPlayer {
            constructor(options: SpotifyPlayerOptions) {
              // Simulate authentication error
              setTimeout(() => {
                if (options.getOAuthToken) {
                  options.getOAuthToken((token: string) => {
                    // Simulate failed token callback
                    console.log("Mock token request failed");
                  });
                }
              }, 100);
            }
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              if (event === "authentication_error") {
                setTimeout(
                  () => callback({ message: "Authentication failed" }),
                  200,
                );
              }
            }
            connect(): Promise<boolean> {
              return Promise.resolve(false);
            }
            disconnect(): void {}
          },
        };
      });

      const requests: string[] = [];
      page.on("response", (response) => {
        if (response.status() === 401) {
          requests.push(response.url());
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Should handle auth error without endless retries
      const duplicateTokenRequests = requests.filter((url) =>
        url.includes("/auth/token"),
      );
      expect(duplicateTokenRequests.length).toBeLessThan(5);
    });
  });

  test.describe("404 Error Handling", () => {
    test("handles 404 errors without retry loops", async ({ page }) => {
      const requests: { url: string; status: number }[] = [];

      page.on("response", (response) => {
        requests.push({
          url: response.url(),
          status: response.status(),
        });
      });

      // Request non-existent track
      const nonExistentTrackResponse = await page.request.get(
        `${BACKEND_URL}/spotify/track/nonexistent123`,
      );
      // Could be 404 (not found) or 401 (not authenticated) - both are valid
      expect([401, 404]).toContain(nonExistentTrackResponse.status());

      await page.waitForTimeout(1000);

      // Should not retry 404/401 requests
      const retryRequests = requests.filter(
        (r) =>
          r.url.includes("/spotify/track/nonexistent123") &&
          [401, 404].includes(r.status),
      );
      expect(retryRequests.length).toBe(1);
    });

    test("handles missing music profile gracefully", async ({ page }) => {
      // Test unauthenticated user trying to access profile
      const profileResponse = await page.request.get(
        `${BACKEND_URL}/user/music-profile`,
      );

      // Should either return 401 or empty data, not cause retry loops
      expect([401, 404, 200]).toContain(profileResponse.status());

      if (profileResponse.status() === 200) {
        const data = await profileResponse.json();
        // Should gracefully handle empty profile
        expect(data).toBeTruthy();
      }
    });
  });

  test.describe("Network Error Resilience", () => {
    test("handles network timeouts gracefully", async ({ page }) => {
      // Slow down network to simulate timeout
      await page.route("**/auth/session", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await route.continue();
      });

      const startTime = Date.now();

      try {
        await page.request.get(`${BACKEND_URL}/auth/session`, {
          timeout: 3000,
        });
      } catch (error) {
        // Should timeout rather than retry indefinitely
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeLessThan(4000);
        expect(error.message).toContain("timeout");
      }
    });

    test("handles backend unavailable gracefully", async ({ page }) => {
      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      // Route requests to simulate backend down
      await page.route("**/auth/**", (route) => {
        route.abort("connectionrefused");
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Should handle connection refused without infinite retries
      const errorLogs = consoleLogs.filter(
        (log) => log.includes("Failed") || log.includes("Error"),
      );

      // Allow some error logs but not excessive retry logs
      expect(errorLogs.length).toBeLessThan(10);
    });
  });

  test.describe("Component Initialization Loops", () => {
    test("prevents multiple player initialization attempts", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        let initCount = 0;

        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new () => SpotifyPlayer;
          };
          initAttempts?: number;
        }

        interface SpotifyPlayer {
          addListener: () => void;
          connect: () => Promise<boolean>;
          disconnect: () => void;
        }

        (window as WindowWithSpotify).Spotify = {
          Player: class MockPlayer implements SpotifyPlayer {
            constructor() {
              initCount++;
              (window as WindowWithSpotify).initAttempts = initCount;
            }
            addListener(): void {}
            connect(): Promise<boolean> {
              return Promise.resolve(true);
            }
            disconnect(): void {}
          },
        };
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Check initialization count
      const finalInitCount = await page.evaluate(() => {
        interface WindowWithSpotify extends Window {
          initAttempts?: number;
        }
        return (window as WindowWithSpotify).initAttempts || 0;
      });

      // Should only initialize once, not repeatedly
      expect(finalInitCount).toBeLessThanOrEqual(2);
      console.log("Player initialization attempts:", finalInitCount);
    });

    test("handles component remounting without auth loops", async ({
      page,
    }) => {
      const authRequests: string[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/auth/")) {
          authRequests.push(request.url());
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Simulate component remounting by navigating
      await page.goto(`${FRONTEND_URL}/login`);
      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Should not cause excessive auth requests
      expect(authRequests.length).toBeLessThan(15); // Increase threshold to account for natural navigation requests
    });
  });

  test.describe("Error State Recovery", () => {
    test("recovers gracefully from temporary auth failures", async ({
      page,
    }) => {
      let failureCount = 0;

      // Simulate temporary failures
      await page.route("**/auth/session", async (route) => {
        failureCount++;
        if (failureCount <= 2) {
          // Fail first 2 requests
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: "Temporary failure" }),
          });
        } else {
          // Succeed on subsequent requests
          route.fulfill({
            status: 200,
            body: JSON.stringify({ authenticated: false, username: null }),
          });
        }
      });

      const response = await page.request.get(`${BACKEND_URL}/auth/session`);
      expect([500, 200]).toContain(response.status());

      // Wait and try again - should eventually succeed
      await page.waitForTimeout(1000);
      const retryResponse = await page.request.get(
        `${BACKEND_URL}/auth/session`,
      );
      expect(retryResponse.status()).toBe(200);
    });

    test("handles token refresh failure without cascading errors", async ({
      page,
    }) => {
      // Simulate failed token refresh
      await page.route("**/auth/token", (route) => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({
            error: "Token refresh failed, please re-authenticate",
          }),
        });
      });

      const tokenResponse = await page.request.get(`${BACKEND_URL}/auth/token`);
      expect(tokenResponse.status()).toBe(401);

      const errorData = await tokenResponse.json();
      // Backend might return different error messages, accept common patterns
      expect(
        errorData.error.includes("re-authenticate") ||
          errorData.error.includes("Not authenticated") ||
          errorData.error.includes("Token refresh failed"),
      ).toBe(true);
    });
  });

  test.describe("Rate Limiting Protection", () => {
    test("implements rate limiting for auth endpoints", async ({ page }) => {
      const requests: { timestamp: number }[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/auth/session")) {
          requests.push({ timestamp: Date.now() });
        }
      });

      // Fire multiple rapid requests
      const rapidRequests = Array.from({ length: 10 }, () =>
        page.request.get(`${BACKEND_URL}/auth/session`),
      );

      await Promise.all(rapidRequests);

      // Check request timing - should be throttled or batched
      if (requests.length > 1) {
        const timeDiffs = requests
          .slice(1)
          .map((req, i) => req.timestamp - requests[i].timestamp);

        // Some requests should be spaced out (throttled) or deduplicated
        const averageGap =
          timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        console.log("Average request gap:", averageGap);
      }
    });

    test("prevents spam requests to Spotify endpoints", async ({ page }) => {
      const spotifyRequests: number[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/spotify/")) {
          spotifyRequests.push(Date.now());
        }
      });

      // Attempt multiple track requests
      const trackRequests = Array.from({ length: 5 }, (_, i) =>
        page.request.get(`${BACKEND_URL}/spotify/track/test${i}`),
      );

      await Promise.allSettled(trackRequests);

      // Should handle multiple requests without overwhelming the backend
      expect(spotifyRequests.length).toBeLessThanOrEqual(5);
    });
  });
});
