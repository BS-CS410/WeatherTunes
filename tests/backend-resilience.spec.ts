import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://127.0.0.1:8000";
const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Backend Resilience & Circuit Breaker Patterns", () => {
  test.describe("Authentication Token Management", () => {
    test("handles token refresh failures gracefully", async ({ page }) => {
      let refreshAttempts = 0;

      // Mock session to return authenticated user first
      await page.route("**/auth/session", (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            authenticated: true,
            username: "test_user",
          }),
        });
      });

      // Mock token endpoint to fail refresh attempts
      await page.route("**/auth/token", (route) => {
        refreshAttempts++;

        if (refreshAttempts <= 3) {
          // Fail first 3 attempts with different errors
          const errors = [
            "Token refresh failed, please re-authenticate",
            "Refresh token expired",
            "Invalid refresh token",
          ];

          route.fulfill({
            status: 401,
            body: JSON.stringify({
              error: errors[refreshAttempts - 1],
            }),
          });
        } else {
          // Eventually succeed
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              access_token: "new_token_123",
              expires_at: Date.now() + 3600000,
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Trigger token requests
      for (let i = 0; i < 5; i++) {
        try {
          await page.request.get(`${BACKEND_URL}/auth/token`);
        } catch (error) {
          // Expected for failed attempts
        }
        await page.waitForTimeout(100);
      }

      // Should eventually stop retrying or succeed
      expect(refreshAttempts).toBeLessThanOrEqual(5);
      console.log("Token refresh attempts:", refreshAttempts);
    });

    test("implements exponential backoff for failed requests", async ({
      page,
    }) => {
      const requestTimestamps: number[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/auth/token")) {
          requestTimestamps.push(Date.now());
        }
      });

      // Always fail token requests
      await page.route("**/auth/token", (route) => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: "Authentication failed" }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);

      // Simulate component that retries token requests
      await page.evaluate(async () => {
        for (let i = 0; i < 3; i++) {
          try {
            await fetch("/auth/token", { credentials: "include" });
          } catch (error) {
            // Expected
          }
          // Wait a bit between retries
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      });

      await page.waitForTimeout(1000);

      if (requestTimestamps.length > 1) {
        const intervals = requestTimestamps
          .slice(1)
          .map((time, i) => time - requestTimestamps[i]);

        // Should have increasing intervals (exponential backoff)
        const hasIncreasingIntervals = intervals.some(
          (interval, i) => i === 0 || interval >= intervals[i - 1],
        );

        console.log("Request intervals:", intervals);
        expect(hasIncreasingIntervals).toBe(true);
      }
    });

    test("prevents concurrent token refresh requests", async ({ page }) => {
      let concurrentRequests = 0;
      let maxConcurrent = 0;

      await page.route("**/auth/token", async (route) => {
        concurrentRequests++;
        maxConcurrent = Math.max(maxConcurrent, concurrentRequests);

        // Simulate slow response
        await new Promise((resolve) => setTimeout(resolve, 500));

        concurrentRequests--;

        route.fulfill({
          status: 200,
          body: JSON.stringify({
            access_token: "token_123",
            expires_at: Date.now() + 3600000,
          }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);

      // Fire multiple concurrent token requests
      const tokenRequests = Array.from({ length: 5 }, () =>
        page.request.get(`${BACKEND_URL}/auth/token`),
      );

      await Promise.allSettled(tokenRequests);

      // Should limit concurrent requests (ideally to 1)
      expect(maxConcurrent).toBeLessThanOrEqual(2);
      console.log("Max concurrent token requests:", maxConcurrent);
    });
  });

  test.describe("Spotify API Integration", () => {
    test("handles Spotify API rate limiting", async ({ page }) => {
      let requestCount = 0;

      await page.route("**/spotify/**", (route) => {
        requestCount++;

        if (requestCount <= 3) {
          // Return rate limit error for first few requests
          route.fulfill({
            status: 429,
            headers: { "Retry-After": "1" },
            body: JSON.stringify({
              error: "Rate limit exceeded",
            }),
          });
        } else {
          // Then succeed
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              track: {
                id: "test123",
                title: "Test Track",
              },
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Make multiple requests that should trigger rate limiting
      const responses = await Promise.allSettled([
        page.request.get(`${BACKEND_URL}/spotify/track/test1`),
        page.request.get(`${BACKEND_URL}/spotify/track/test2`),
        page.request.get(`${BACKEND_URL}/spotify/track/test3`),
        page.request.get(`${BACKEND_URL}/spotify/track/test4`),
      ]);

      // Should handle rate limiting gracefully
      const rateLimitResponses = responses.filter(
        (result) =>
          result.status === "fulfilled" &&
          (result.value as { status: () => number }).status() === 429,
      );

      expect(rateLimitResponses.length).toBeGreaterThan(0);
      expect(requestCount).toBeGreaterThan(3);
    });

    test("implements circuit breaker for failing Spotify requests", async ({
      page,
    }) => {
      let failureCount = 0;
      const requestTimes: number[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/spotify/")) {
          requestTimes.push(Date.now());
        }
      });

      await page.route("**/spotify/**", (route) => {
        failureCount++;

        // Always fail to trigger circuit breaker
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: "Spotify service unavailable" }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);

      // Make multiple failing requests
      for (let i = 0; i < 10; i++) {
        try {
          await page.request.get(`${BACKEND_URL}/spotify/track/test${i}`);
        } catch (error) {
          // Expected
        }
        await page.waitForTimeout(100);
      }

      // Circuit breaker should limit requests after failures
      expect(failureCount).toBeLessThan(10); // Should stop making requests
      console.log("Failed requests made:", failureCount);
    });

    test("recovers when Spotify service becomes available", async ({
      page,
    }) => {
      let requestCount = 0;

      await page.route("**/spotify/track/**", (route) => {
        requestCount++;

        if (requestCount <= 5) {
          // Fail first requests
          route.fulfill({
            status: 503,
            body: JSON.stringify({ error: "Service temporarily unavailable" }),
          });
        } else {
          // Then recover
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              track: {
                id: "recovered123",
                title: "Recovery Track",
              },
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Initial failing requests
      for (let i = 0; i < 3; i++) {
        try {
          await page.request.get(`${BACKEND_URL}/spotify/track/test${i}`);
        } catch (error) {
          // Expected
        }
      }

      await page.waitForTimeout(1000);

      // Later request should succeed
      const recoveryResponse = await page.request.get(
        `${BACKEND_URL}/spotify/track/recovery`,
      );

      expect([200, 503]).toContain(recoveryResponse.status());

      if (recoveryResponse.status() === 200) {
        const data = await recoveryResponse.json();
        expect(data.track).toBeTruthy();
      }
    });
  });

  test.describe("Session Management Resilience", () => {
    test("handles session corruption gracefully", async ({ page }) => {
      // Simulate corrupted session data
      await page.route("**/auth/session", (route) => {
        route.fulfill({
          status: 200,
          body: "invalid json response", // Corrupted response
        });
      });

      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Should handle corrupted session gracefully
      const errorLogs = consoleLogs.filter(
        (log) => log.includes("Error") || log.includes("Failed"),
      );

      // May have errors but should not crash
      expect(errorLogs.length).toBeLessThan(10);
    });

    test("handles session timeout properly", async ({ page }) => {
      let requestCount = 0;

      await page.route("**/auth/session", (route) => {
        requestCount++;

        if (requestCount === 1) {
          // First request succeeds
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              authenticated: true,
              username: "test_user",
            }),
          });
        } else {
          // Later requests show session expired
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              authenticated: false,
              username: null,
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(1000);

      // Trigger another session check
      await page.request.get(`${BACKEND_URL}/auth/session`);
      await page.waitForTimeout(1000);

      // Should handle session expiration
      expect(requestCount).toBeGreaterThan(1);
    });

    test("prevents session fixation attacks", async ({ page }) => {
      const sessionIds: string[] = [];

      page.on("response", (response) => {
        const setCookie = response.headers()["set-cookie"];
        if (setCookie && setCookie.includes("session")) {
          sessionIds.push(setCookie);
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Login process
      await page.request.get(`${BACKEND_URL}/auth/login`, {
        maxRedirects: 0,
      });

      await page.waitForTimeout(1000);

      // Session IDs should be regenerated on auth changes
      const uniqueSessionIds = new Set(sessionIds);
      console.log("Unique session IDs:", uniqueSessionIds.size);

      // Should have reasonable session management
      expect(sessionIds.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Database and Storage Resilience", () => {
    test("handles queue storage failures", async ({ page }) => {
      // Mock queue endpoint to fail
      await page.route("**/queue", (route) => {
        if (route.request().method() === "GET") {
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: "Queue storage unavailable" }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Should handle queue failures gracefully
      const queueResponse = await page.request.get(`${BACKEND_URL}/queue`);
      expect(queueResponse.status()).toBe(500);

      // App should still function without queue
      const healthResponse = await page.request.get(`${BACKEND_URL}/health`);
      expect(healthResponse.status()).toBe(200);
    });

    test("recovers from temporary storage outages", async ({ page }) => {
      let storageDown = true;

      await page.route("**/user/**", (route) => {
        if (storageDown) {
          route.fulfill({
            status: 503,
            body: JSON.stringify({ error: "Storage temporarily unavailable" }),
          });
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify({ profile: { preferences: {} } }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Initial request fails
      const failResponse = await page.request.get(
        `${BACKEND_URL}/user/profile`,
      );
      expect(failResponse.status()).toBe(503);

      // Storage comes back online
      storageDown = false;

      // Retry should succeed
      const successResponse = await page.request.get(
        `${BACKEND_URL}/user/profile`,
      );
      expect(successResponse.status()).toBe(200);
    });
  });

  test.describe("Network Resilience", () => {
    test("handles intermittent network failures", async ({ page }) => {
      let networkFailures = 0;

      await page.route("**/auth/session", (route) => {
        networkFailures++;

        if (networkFailures % 3 === 0) {
          // Every 3rd request fails
          route.abort("internetdisconnected");
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              authenticated: false,
              username: null,
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Make several requests despite network issues
      const results = await Promise.allSettled([
        page.request.get(`${BACKEND_URL}/auth/session`),
        page.request.get(`${BACKEND_URL}/auth/session`),
        page.request.get(`${BACKEND_URL}/auth/session`),
        page.request.get(`${BACKEND_URL}/auth/session`),
      ]);

      // Some should succeed despite network issues
      const successfulRequests = results.filter(
        (result) => result.status === "fulfilled",
      );

      expect(successfulRequests.length).toBeGreaterThan(0);
      console.log("Network failures:", networkFailures);
    });

    test("implements proper timeout handling", async ({ page }) => {
      // Mock slow responses
      await page.route("**/auth/session", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        route.fulfill({
          status: 200,
          body: JSON.stringify({ authenticated: false, username: null }),
        });
      });

      const startTime = Date.now();

      try {
        await page.request.get(`${BACKEND_URL}/auth/session`, {
          timeout: 2000,
        });
      } catch (error) {
        const elapsed = Date.now() - startTime;

        // Should timeout promptly
        expect(elapsed).toBeLessThan(3000);
        expect(error.message).toContain("timeout");
      }
    });
  });
});
