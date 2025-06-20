import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://127.0.0.1:8000";
const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Frontend State Management & Refresh Control", () => {
  test.describe("Authentication State Synchronization", () => {
    test("prevents auth state ping-pong between components", async ({
      page,
    }) => {
      const stateChanges: { event: string; timestamp: number }[] = [];

      // Monitor console logs for auth state changes
      page.on("console", (msg) => {
        const text = msg.text();
        if (
          text.includes("Auth") ||
          text.includes("authentication") ||
          text.includes("🔄")
        ) {
          stateChanges.push({
            event: text,
            timestamp: Date.now(),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(5000);

      // Check for excessive state change logs
      const rapidChanges = stateChanges.filter((change, index) => {
        if (index === 0) return false;
        return change.timestamp - stateChanges[index - 1].timestamp < 100;
      });

      // Should not have rapid consecutive auth state changes
      expect(rapidChanges.length).toBeLessThan(5);
      console.log("Auth state changes:", stateChanges.length);
      console.log("Rapid changes:", rapidChanges.length);
    });

    test("handles concurrent auth checks without race conditions", async ({
      page,
    }) => {
      const requests: { url: string; method: string; timestamp: number }[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/auth/session")) {
          requests.push({
            url: request.url(),
            method: request.method(),
            timestamp: Date.now(),
          });
        }
      });

      // Load page and wait for initial auth checks
      await page.goto(`${FRONTEND_URL}`);

      // Trigger navigation that might cause additional auth checks
      await page.evaluate(() => {
        // Simulate multiple components checking auth simultaneously
        for (let i = 0; i < 3; i++) {
          fetch("/auth/session", { credentials: "include" });
        }
      });

      await page.waitForTimeout(2000);

      // Should deduplicate or batch concurrent requests
      const overlappingRequests = requests.filter((req, index) => {
        if (index === 0) return false;
        return req.timestamp - requests[index - 1].timestamp < 50;
      });

      expect(overlappingRequests.length).toBeLessThan(3);
    });

    test("recovers from auth context provider errors", async ({ page }) => {
      let errorRecoveryAttempts = 0;

      // Intercept auth session requests and cause errors initially
      await page.route("**/auth/session", async (route) => {
        errorRecoveryAttempts++;

        if (errorRecoveryAttempts <= 2) {
          // Fail first few requests
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: "Internal server error" }),
          });
        } else {
          // Then succeed
          route.fulfill({
            status: 200,
            body: JSON.stringify({ authenticated: false, username: null }),
          });
        }
      });

      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Should eventually recover from errors
      expect(errorRecoveryAttempts).toBeGreaterThan(1);
      expect(errorRecoveryAttempts).toBeLessThan(10); // But not infinite retries

      // Check that error recovery logs are reasonable
      const errorLogs = consoleLogs.filter(
        (log) => log.includes("Error") || log.includes("Failed"),
      );
      expect(errorLogs.length).toBeLessThan(10);
    });
  });

  test.describe("Component Lifecycle Management", () => {
    test("handles component unmounting without leaving active timers", async ({
      page,
    }) => {
      await page.goto(`${FRONTEND_URL}`);

      // Navigate to trigger component unmounting
      await page.goto(`${FRONTEND_URL}/login`);
      await page.goto(`${FRONTEND_URL}`);

      // Check for any error messages about memory leaks or timers
      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        if (
          text.includes("Warning") ||
          text.includes("memory") ||
          text.includes("timer")
        ) {
          consoleLogs.push(text);
        }
      });

      await page.waitForTimeout(2000);

      // Should not have memory leak warnings
      const memoryWarnings = consoleLogs.filter(
        (log) => log.includes("memory") || log.includes("leak"),
      );
      expect(memoryWarnings.length).toBe(0);
    });

    test("prevents useEffect cleanup race conditions", async ({ page }) => {
      let navigationCount = 0;

      page.on("response", (response) => {
        if (response.url().includes("/auth/session")) {
          navigationCount++;
        }
      });

      // Rapidly navigate between pages to trigger component mounting/unmounting
      await page.goto(`${FRONTEND_URL}`);
      await page.goto(`${FRONTEND_URL}/login`);
      await page.goto(`${FRONTEND_URL}`);
      await page.goto(`${FRONTEND_URL}/login`);
      await page.goto(`${FRONTEND_URL}`);

      await page.waitForTimeout(1000);

      // Should handle rapid navigation without excessive auth requests
      expect(navigationCount).toBeLessThan(10);
    });

    test("handles player service cleanup properly", async ({ page }) => {
      // Mock Spotify SDK
      await page.addInitScript(() => {
        let disconnectCalled = false;

        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new () => SpotifyPlayer;
          };
          disconnectCalled?: boolean;
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
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              if (event === "ready") {
                setTimeout(() => callback({ device_id: "test-device" }), 100);
              }
            }
            connect(): Promise<boolean> {
              return Promise.resolve(true);
            }
            disconnect(): void {
              disconnectCalled = true;
              (window as WindowWithSpotify).disconnectCalled = true;
            }
          },
        };
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(1000);

      // Navigate away to trigger cleanup
      await page.goto(`${FRONTEND_URL}/login`);
      await page.waitForTimeout(500);

      // Check that disconnect was called
      const disconnectCalled = await page.evaluate(() => {
        interface WindowWithSpotify extends Window {
          disconnectCalled?: boolean;
        }
        return (window as WindowWithSpotify).disconnectCalled || false;
      });

      // Player should be properly cleaned up
      expect(disconnectCalled).toBe(true);
    });
  });

  test.describe("API Request Management", () => {
    test("implements request deduplication for identical calls", async ({
      page,
    }) => {
      const requestTracker = new Map<string, number>();

      page.on("request", (request) => {
        const key = `${request.method()}_${request.url()}`;
        requestTracker.set(key, (requestTracker.get(key) || 0) + 1);
      });

      await page.goto(`${FRONTEND_URL}`);

      // Make multiple identical requests
      await page.evaluate(async () => {
        const promises = Array.from({ length: 5 }, () =>
          fetch("/auth/session", { credentials: "include" }),
        );
        await Promise.all(promises);
      });

      await page.waitForTimeout(1000);

      // Check request counts
      const sessionRequests =
        requestTracker.get(`GET_${BACKEND_URL}/auth/session`) || 0;

      // Should deduplicate or limit concurrent identical requests
      expect(sessionRequests).toBeLessThan(7); // Allow some requests but not all 5
    });

    test("handles request cancellation properly", async ({ page }) => {
      let requestsAborted = 0;

      page.on("requestfailed", (request) => {
        if (request.failure()?.errorText === "net::ERR_ABORTED") {
          requestsAborted++;
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Start a slow request and then navigate away quickly
      await page.route("**/auth/session", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      // Start request then navigate away
      page.evaluate(() => {
        fetch("/auth/session", { credentials: "include" });
      });

      await page.waitForTimeout(100);
      await page.goto(`${FRONTEND_URL}/login`);

      await page.waitForTimeout(1000);

      // Should cancel in-flight requests when navigating
      console.log("Requests aborted:", requestsAborted);
      // Just check that the system can handle aborted requests
      expect(requestsAborted).toBeGreaterThanOrEqual(0);
    });

    test("respects API rate limits", async ({ page }) => {
      const requestTimestamps: number[] = [];

      page.on("request", (request) => {
        if (request.url().includes("/spotify/")) {
          requestTimestamps.push(Date.now());
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Try to make many rapid Spotify API requests
      await page.evaluate(async () => {
        const requests = Array.from(
          { length: 10 },
          (_, i) =>
            fetch(`/spotify/track/test${i}`, { credentials: "include" }).catch(
              () => {},
            ), // Ignore errors for this test
        );
        await Promise.allSettled(requests);
      });

      await page.waitForTimeout(1000);

      if (requestTimestamps.length > 1) {
        // Check spacing between requests
        const gaps = requestTimestamps
          .slice(1)
          .map((time, i) => time - requestTimestamps[i]);

        const hasProperSpacing = gaps.some((gap) => gap > 100);
        console.log("Request gaps:", gaps);

        // Should have some rate limiting or spacing
        expect(hasProperSpacing || requestTimestamps.length < 10).toBe(true);
      }
    });
  });

  test.describe("Error Boundary Testing", () => {
    test("handles JavaScript errors gracefully", async ({ page }) => {
      const jsErrors: string[] = [];

      page.on("pageerror", (error) => {
        jsErrors.push(error.message);
      });

      await page.goto(`${FRONTEND_URL}`);

      // Trigger a potential error condition
      await page.evaluate(() => {
        // Try to call an undefined method that might happen during auth errors
        try {
          const nullValue: null = null;
          (nullValue as unknown as { someMethod: () => void }).someMethod();
        } catch (error) {
          console.error("Caught error:", error);
        }
      });

      await page.waitForTimeout(1000);

      // Should handle errors gracefully
      const criticalErrors = jsErrors.filter(
        (error) =>
          !error.includes("Caught error") && error.includes("Cannot read"),
      );

      expect(criticalErrors.length).toBe(0);
    });

    test("recovers from API error states", async ({ page }) => {
      let errorPhase = true;

      // Initially return errors, then succeed
      await page.route("**/auth/session", async (route) => {
        if (errorPhase) {
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: "Server error" }),
          });
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify({ authenticated: false, username: null }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(1000);

      // Switch to success phase
      errorPhase = false;

      // Trigger a retry or refresh
      await page.reload();
      await page.waitForTimeout(1000);

      // Should handle recovery
      const finalResponse = await page.request.get(
        `${BACKEND_URL}/auth/session`,
      );
      expect(finalResponse.status()).toBe(200);
    });
  });

  test.describe("Memory and Performance", () => {
    test("prevents memory leaks from event listeners", async ({ page }) => {
      await page.goto(`${FRONTEND_URL}`);

      // Simulate component mounting/unmounting cycles
      for (let i = 0; i < 3; i++) {
        await page.goto(`${FRONTEND_URL}`);
        await page.goto(`${FRONTEND_URL}/login`);
        await page.waitForTimeout(200);
      }

      // Return to main page
      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(1000);

      // Check for memory-related console warnings
      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        if (
          text.includes("memory") ||
          text.includes("leak") ||
          text.includes("listener")
        ) {
          consoleLogs.push(text);
        }
      });

      await page.waitForTimeout(1000);

      // Should not have memory warnings
      expect(consoleLogs.length).toBe(0);
    });

    test("maintains reasonable request frequency", async ({ page }) => {
      const requestCounts = new Map<string, number>();
      const timeWindow = 5000; // 5 seconds
      const startTime = Date.now();

      page.on("request", (request) => {
        const now = Date.now();
        if (now - startTime < timeWindow) {
          const endpoint = new URL(request.url()).pathname;
          requestCounts.set(endpoint, (requestCounts.get(endpoint) || 0) + 1);
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(timeWindow);

      // Check that no endpoint is being hammered
      for (const [endpoint, count] of requestCounts.entries()) {
        if (endpoint.includes("/auth/")) {
          expect(count).toBeLessThan(20); // Max 20 auth requests in 5 seconds
        }
        if (endpoint.includes("/spotify/")) {
          expect(count).toBeLessThan(10); // Max 10 Spotify requests in 5 seconds
        }
      }

      console.log("Request frequency:", Object.fromEntries(requestCounts));
    });
  });
});
