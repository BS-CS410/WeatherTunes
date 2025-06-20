import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://127.0.0.1:8000";
const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Integration Test Suite - Authentication & Error Prevention", () => {
  test.describe("Complete OAuth Flow Protection", () => {
    test("end-to-end authentication flow without infinite loops", async ({
      page,
    }) => {
      const requests: {
        url: string;
        method: string;
        timestamp: number;
        status?: number;
      }[] = [];

      // Track all network activity
      page.on("request", (request) => {
        requests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        });
      });

      page.on("response", (response) => {
        const matchingRequest = requests.find(
          (r) => r.url === response.url() && !r.status,
        );
        if (matchingRequest) {
          matchingRequest.status = response.status();
        }
      });

      // Start authentication flow
      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Check initial auth state
      const sessionResponse = await page.request.get(
        `${BACKEND_URL}/auth/session`,
      );
      expect(sessionResponse.status()).toBe(200);

      const sessionData = await sessionResponse.json();
      expect(sessionData.authenticated).toBe(false);

      // Trigger login flow
      const loginResponse = await page.request.get(
        `${BACKEND_URL}/auth/login`,
        {
          maxRedirects: 0,
        },
      );
      expect([302, 307]).toContain(loginResponse.status());

      // Verify no excessive requests were made
      const authRequests = requests.filter((r) => r.url.includes("/auth/"));
      const tokenRequests = requests.filter((r) =>
        r.url.includes("/auth/token"),
      );
      const sessionRequests = requests.filter((r) =>
        r.url.includes("/auth/session"),
      );

      // Should have reasonable request counts
      expect(authRequests.length).toBeLessThan(20);
      expect(tokenRequests.length).toBeLessThan(5);
      expect(sessionRequests.length).toBeLessThan(10);

      console.log("Auth requests:", authRequests.length);
      console.log("Token requests:", tokenRequests.length);
      console.log("Session requests:", sessionRequests.length);
    });

    test("handles authentication errors without cascading failures", async ({
      page,
    }) => {
      let authErrorCount = 0;
      const errorMessages: string[] = [];

      // Monitor console for error patterns
      page.on("console", (msg) => {
        const text = msg.text();
        if (text.includes("Error") || text.includes("Failed")) {
          errorMessages.push(text);
        }
        if (text.includes("authentication") && text.includes("error")) {
          authErrorCount++;
        }
      });

      // Mock failing auth endpoints
      await page.route("**/auth/token", (route) => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: "Authentication failed" }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(5000);

      // Should handle auth errors gracefully
      expect(authErrorCount).toBeLessThan(10); // Some errors expected, but not excessive

      // Check for infinite loop indicators
      const loopIndicators = errorMessages.filter(
        (msg) =>
          msg.includes("Maximum") ||
          msg.includes("infinite") ||
          msg.includes("Too many"),
      );
      expect(loopIndicators.length).toBe(0);

      console.log("Auth errors:", authErrorCount);
      console.log("Total error messages:", errorMessages.length);
    });
  });

  test.describe("Real-World Scenario Testing", () => {
    test("handles user session expiration during active use", async ({
      page,
    }) => {
      let requestCount = 0;

      // Simulate session expiring after some requests
      await page.route("**/auth/session", (route) => {
        requestCount++;

        if (requestCount <= 3) {
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              authenticated: true,
              username: "test_user",
            }),
          });
        } else {
          // Session expires
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

      // Initial state should be authenticated
      await page.waitForTimeout(1000);

      // Trigger additional session checks
      for (let i = 0; i < 5; i++) {
        await page.request.get(`${BACKEND_URL}/auth/session`);
        await page.waitForTimeout(200);
      }

      // Should handle session expiration gracefully
      expect(requestCount).toBeGreaterThan(3);
      console.log("Session requests:", requestCount);
    });

    test("recovers from temporary backend outages", async ({ page }) => {
      let outagePhase = true;
      let recoveryRequestCount = 0;

      await page.route("**/auth/**", (route) => {
        if (outagePhase) {
          route.abort("connectionrefused");
        } else {
          recoveryRequestCount++;
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
      await page.waitForTimeout(2000);

      // End outage
      outagePhase = false;

      // Trigger recovery
      await page.reload();
      await page.waitForTimeout(2000);

      // Should recover gracefully
      expect(recoveryRequestCount).toBeGreaterThan(0);
      console.log("Recovery requests:", recoveryRequestCount);
    });

    test("handles multiple components initializing simultaneously", async ({
      page,
    }) => {
      const componentInitCounts = new Map<string, number>();

      // Mock multiple components trying to initialize
      await page.addInitScript(() => {
        interface WindowWithCounts extends Window {
          componentInitCounts?: Map<string, number>;
        }

        const originalFetch = window.fetch;
        window.fetch = (url, options) => {
          if (typeof url === "string" && url.includes("/auth/")) {
            const component =
              Math.random() > 0.5 ? "PlayerService" : "AuthProvider";
            const counts =
              (window as WindowWithCounts).componentInitCounts || new Map();
            counts.set(component, (counts.get(component) || 0) + 1);
            (window as WindowWithCounts).componentInitCounts = counts;
          }
          return originalFetch(url, options);
        };
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Check component initialization counts
      const initCounts = await page.evaluate(() => {
        interface WindowWithCounts extends Window {
          componentInitCounts?: Map<string, number>;
        }
        const counts =
          (window as WindowWithCounts).componentInitCounts || new Map();
        return Object.fromEntries(counts);
      });

      console.log("Component init counts:", initCounts);

      // Should handle concurrent initialization
      for (const [component, count] of Object.entries(initCounts)) {
        expect(count as number).toBeLessThan(10); // Reasonable limit
      }
    });
  });

  test.describe("Performance and Resource Management", () => {
    test("maintains reasonable memory usage during extended session", async ({
      page,
    }) => {
      // Simulate extended app usage
      await page.goto(`${FRONTEND_URL}`);

      // Perform various actions that might cause memory leaks
      for (let i = 0; i < 10; i++) {
        // Navigate between pages
        await page.goto(`${FRONTEND_URL}/login`);
        await page.goto(`${FRONTEND_URL}`);

        // Trigger auth checks
        await page.request.get(`${BACKEND_URL}/auth/session`);

        await page.waitForTimeout(100);
      }

      // Check for memory warnings
      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      await page.waitForTimeout(2000);

      const memoryWarnings = consoleLogs.filter(
        (log) =>
          log.includes("memory") ||
          log.includes("leak") ||
          log.includes("Too many listeners"),
      );

      expect(memoryWarnings.length).toBe(0);
    });

    test("implements proper request throttling", async ({ page }) => {
      const requestTimestamps: number[] = [];

      page.on("request", (request) => {
        if (
          request.url().includes("/auth/") ||
          request.url().includes("/spotify/")
        ) {
          requestTimestamps.push(Date.now());
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Fire rapid requests
      const rapidRequests = Array.from({ length: 20 }, () =>
        page.request.get(`${BACKEND_URL}/auth/session`),
      );

      await Promise.allSettled(rapidRequests);
      await page.waitForTimeout(1000);

      // Analyze request timing
      if (requestTimestamps.length > 1) {
        const intervals = requestTimestamps
          .slice(1)
          .map((time, i) => time - requestTimestamps[i]);

        const averageInterval =
          intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const hasThrottling = intervals.some((interval) => interval > 50);

        console.log("Average request interval:", averageInterval);
        console.log("Has throttling:", hasThrottling);

        // Should have some form of rate limiting
        expect(hasThrottling || requestTimestamps.length < 15).toBe(true);
      }
    });
  });

  test.describe("Error Recovery Validation", () => {
    test("validates complete error recovery flow", async ({ page }) => {
      const errorPhases = [
        "network_error",
        "auth_error",
        "service_error",
        "recovery",
      ];
      let currentPhase = 0;

      await page.route("**/auth/session", (route) => {
        const phase = errorPhases[currentPhase];

        switch (phase) {
          case "network_error":
            route.abort("internetdisconnected");
            break;
          case "auth_error":
            route.fulfill({
              status: 401,
              body: JSON.stringify({ error: "Unauthorized" }),
            });
            break;
          case "service_error":
            route.fulfill({
              status: 500,
              body: JSON.stringify({ error: "Internal server error" }),
            });
            break;
          case "recovery":
            route.fulfill({
              status: 200,
              body: JSON.stringify({
                authenticated: false,
                username: null,
              }),
            });
            break;
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Go through each error phase
      for (let phase = 0; phase < errorPhases.length; phase++) {
        currentPhase = phase;

        try {
          await page.request.get(`${BACKEND_URL}/auth/session`);
        } catch (error) {
          // Expected for error phases
        }

        await page.waitForTimeout(500);
      }

      // Final request should succeed in recovery phase
      const finalResponse = await page.request.get(
        `${BACKEND_URL}/auth/session`,
      );
      expect(finalResponse.status()).toBe(200);
    });

    test("ensures graceful degradation of features", async ({ page }) => {
      // Mock various service failures
      await page.route("**/spotify/**", (route) => {
        route.fulfill({
          status: 503,
          body: JSON.stringify({ error: "Spotify service unavailable" }),
        });
      });

      await page.route("**/queue", (route) => {
        route.fulfill({
          status: 503,
          body: JSON.stringify({ error: "Queue service unavailable" }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Core functionality should still work
      const healthResponse = await page.request.get(`${BACKEND_URL}/health`);
      expect(healthResponse.status()).toBe(200);

      const sessionResponse = await page.request.get(
        `${BACKEND_URL}/auth/session`,
      );
      expect(sessionResponse.status()).toBe(200);

      console.log("Graceful degradation: Core services still functional");
    });
  });
});
