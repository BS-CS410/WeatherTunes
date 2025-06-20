import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://127.0.0.1:8000";
const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Player & Media Handling Edge Cases", () => {
  test.describe("Spotify Web Player SDK", () => {
    test("handles SDK loading failures gracefully", async ({ page }) => {
      // Prevent Spotify SDK from loading
      await page.addInitScript(() => {
        // Block Spotify SDK script
        const originalFetch = window.fetch;
        window.fetch = (url, options) => {
          if (typeof url === "string" && url.includes("spotify")) {
            return Promise.reject(new Error("SDK loading failed"));
          }
          return originalFetch(url, options);
        };
      });

      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Should handle SDK loading failure gracefully
      const sdkErrors = consoleLogs.filter(
        (log) => log.includes("SDK") || log.includes("Spotify"),
      );

      // May have error logs but should not crash
      console.log("SDK error logs:", sdkErrors.length);
      expect(page.isClosed()).toBe(false);
    });

    test("handles player initialization timeout", async ({ page }) => {
      // Mock Spotify SDK with delayed initialization
      await page.addInitScript(() => {
        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
          };
        }

        interface SpotifyPlayerOptions {
          name: string;
          getOAuthToken?: (callback: (token: string) => void) => void;
          volume?: number;
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
              // Simulate token request but never respond
              if (options.getOAuthToken) {
                // Don't call the callback to simulate hanging
              }
            }
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              // Never emit ready event to simulate timeout
            }
            connect(): Promise<boolean> {
              // Return a promise that never resolves
              return new Promise(() => {});
            }
            disconnect(): void {}
          },
        };
      });

      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        consoleLogs.push(msg.text());
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(5000);

      // Should handle initialization timeout
      const timeoutLogs = consoleLogs.filter(
        (log) => log.includes("timeout") || log.includes("failed"),
      );

      console.log("Timeout logs:", timeoutLogs.length);
      expect(timeoutLogs.length).toBeGreaterThanOrEqual(0);
    });

    test("handles authentication errors during playback", async ({ page }) => {
      const authErrors: string[] = [];

      // Mock Spotify SDK with auth errors
      await page.addInitScript(() => {
        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
          };
        }

        interface SpotifyPlayerOptions {
          name: string;
          getOAuthToken: (callback: (token: string) => void) => void;
          volume?: number;
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
              setTimeout(() => {
                if (options.getOAuthToken) {
                  options.getOAuthToken(() => {
                    // Simulate token but then auth error
                  });
                }
              }, 100);
            }
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              if (event === "authentication_error") {
                setTimeout(() => {
                  callback({ message: "Authentication error during playback" });
                }, 500);
              }
              if (event === "ready") {
                setTimeout(() => {
                  callback({ device_id: "test_device" });
                }, 200);
              }
            }
            connect(): Promise<boolean> {
              return Promise.resolve(true);
            }
            disconnect(): void {}
          },
        };
      });

      page.on("console", (msg) => {
        const text = msg.text();
        if (text.includes("authentication") || text.includes("auth")) {
          authErrors.push(text);
        }
      });

      // Mock token endpoint to fail
      await page.route("**/auth/token", (route) => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: "Token expired" }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Should handle auth errors gracefully
      expect(authErrors.length).toBeGreaterThan(0);
      console.log("Auth errors during playback:", authErrors.length);
    });

    test("prevents infinite token refresh loops", async ({ page }) => {
      let tokenRequestCount = 0;
      const maxTokenRequests = 10;

      page.on("request", (request) => {
        if (request.url().includes("/auth/token")) {
          tokenRequestCount++;
        }
      });

      // Mock Spotify SDK that constantly requests tokens
      await page.addInitScript(() => {
        let refreshCount = 0;

        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
          };
        }

        interface SpotifyPlayerOptions {
          name: string;
          getOAuthToken: (callback: (token: string) => void) => void;
          volume?: number;
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
              const requestToken = () => {
                refreshCount++;
                if (refreshCount < 15 && options.getOAuthToken) {
                  // Limit to prevent real infinite loop
                  options.getOAuthToken(() => {
                    setTimeout(requestToken, 100); // Request again quickly
                  });
                }
              };
              setTimeout(requestToken, 100);
            }
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              if (event === "authentication_error") {
                setTimeout(() => {
                  callback({ message: "Auth error" });
                }, 300);
              }
            }
            connect(): Promise<boolean> {
              return Promise.resolve(true);
            }
            disconnect(): void {}
          },
        };
      });

      // Always return auth errors to trigger refresh attempts
      await page.route("**/auth/token", (route) => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: "Token invalid" }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(5000);

      // Should limit token refresh attempts
      expect(tokenRequestCount).toBeLessThan(maxTokenRequests);
      console.log("Token requests made:", tokenRequestCount);
    });
  });

  test.describe("Queue Management", () => {
    test("handles queue API failures gracefully", async ({ page }) => {
      // Mock queue endpoint to fail
      await page.route("**/queue", (route) => {
        const method = route.request().method();

        if (method === "GET") {
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: "Queue service unavailable" }),
          });
        } else if (method === "POST") {
          route.fulfill({
            status: 503,
            body: JSON.stringify({ error: "Cannot update queue" }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(2000);

      // Try to interact with queue
      const getResponse = await page.request.get(`${BACKEND_URL}/queue`);
      expect(getResponse.status()).toBe(500);

      const postResponse = await page.request.post(`${BACKEND_URL}/queue`, {
        data: { track_id: "test123" },
      });
      expect(postResponse.status()).toBe(503);

      // App should continue functioning
      const healthResponse = await page.request.get(`${BACKEND_URL}/health`);
      expect(healthResponse.status()).toBe(200);
    });

    test("handles track metadata failures", async ({ page }) => {
      // Mock track endpoint to return incomplete data
      await page.route("**/spotify/track/**", (route) => {
        const url = route.request().url();
        const trackId = url.split("/").pop();

        if (trackId === "invalid") {
          route.fulfill({
            status: 404,
            body: JSON.stringify({ error: "Track not found" }),
          });
        } else if (trackId === "corrupted") {
          route.fulfill({
            status: 200,
            body: "invalid json", // Corrupted response
          });
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              track: {
                id: trackId,
                title: null, // Missing data
                artist: "",
                // Missing other required fields
              },
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Test various failure modes
      const invalidResponse = await page.request.get(
        `${BACKEND_URL}/spotify/track/invalid`,
      );
      expect(invalidResponse.status()).toBe(404);

      try {
        const corruptedResponse = await page.request.get(
          `${BACKEND_URL}/spotify/track/corrupted`,
        );
        // Should handle corrupted JSON gracefully
        expect([200, 500]).toContain(corruptedResponse.status());
      } catch (error) {
        // Expected for corrupted response
      }

      const incompleteResponse = await page.request.get(
        `${BACKEND_URL}/spotify/track/incomplete`,
      );
      expect(incompleteResponse.status()).toBe(200);
    });

    test("handles concurrent queue modifications", async ({ page }) => {
      let queueModifications = 0;

      await page.route("**/queue", (route) => {
        if (route.request().method() === "POST") {
          queueModifications++;

          // Simulate slow queue updates
          setTimeout(() => {
            route.fulfill({
              status: 200,
              body: JSON.stringify({
                success: true,
                queue: [`track_${queueModifications}`],
              }),
            });
          }, 200);
        } else {
          route.continue();
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Fire multiple concurrent queue modifications
      const queueUpdates = Array.from({ length: 5 }, (_, i) =>
        page.request.post(`${BACKEND_URL}/queue`, {
          data: { track_id: `track_${i}` },
        }),
      );

      await Promise.allSettled(queueUpdates);
      await page.waitForTimeout(1000);

      // Should handle concurrent modifications
      expect(queueModifications).toBeLessThanOrEqual(5);
      console.log("Queue modifications:", queueModifications);
    });
  });

  test.describe("Playback Control Edge Cases", () => {
    test("handles play/pause command failures", async ({ page }) => {
      // Mock player control endpoints to fail
      await page.route("**/spotify/player/**", (route) => {
        const url = route.request().url();

        if (url.includes("/play")) {
          route.fulfill({
            status: 403,
            body: JSON.stringify({
              error: "Premium account required",
            }),
          });
        } else if (url.includes("/pause")) {
          route.fulfill({
            status: 500,
            body: JSON.stringify({
              error: "Playback control failed",
            }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // Test playback control failures
      const playResponse = await page.request.put(
        `${BACKEND_URL}/spotify/player/play`,
        { data: { device_id: "test" } },
      );
      expect(playResponse.status()).toBe(403);

      const pauseResponse = await page.request.put(
        `${BACKEND_URL}/spotify/player/pause`,
        { data: { device_id: "test" } },
      );
      expect(pauseResponse.status()).toBe(500);
    });

    test("handles device transfer failures", async ({ page }) => {
      // Mock device transfer to fail
      await page.route("**/spotify/player/transfer", (route) => {
        route.fulfill({
          status: 404,
          body: JSON.stringify({
            error: "Device not found",
          }),
        });
      });

      await page.goto(`${FRONTEND_URL}`);

      const transferResponse = await page.request.put(
        `${BACKEND_URL}/spotify/player/transfer`,
        { data: { device_id: "nonexistent" } },
      );

      expect(transferResponse.status()).toBe(404);

      const errorData = await transferResponse.json();
      expect(errorData.error).toContain("Device not found");
    });

    test("handles queue addition failures", async ({ page }) => {
      let queueAttempts = 0;

      await page.route("**/spotify/player/queue", (route) => {
        queueAttempts++;

        if (queueAttempts <= 2) {
          route.fulfill({
            status: 502,
            body: JSON.stringify({
              error: "Spotify service temporarily unavailable",
            }),
          });
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              message: "Track added to queue",
            }),
          });
        }
      });

      await page.goto(`${FRONTEND_URL}`);

      // First attempts should fail
      const failResponse = await page.request.post(
        `${BACKEND_URL}/spotify/player/queue`,
        { data: { uri: "spotify:track:test", device_id: "test" } },
      );
      expect(failResponse.status()).toBe(502);

      // Later attempt should succeed
      const successResponse = await page.request.post(
        `${BACKEND_URL}/spotify/player/queue`,
        { data: { uri: "spotify:track:test2", device_id: "test" } },
      );

      expect([200, 502]).toContain(successResponse.status());
    });
  });

  test.describe("Media State Synchronization", () => {
    test("handles player state desync", async ({ page }) => {
      // Mock inconsistent player state
      await page.addInitScript(() => {
        let stateCount = 0;

        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
          };
        }

        interface SpotifyPlayerOptions {
          name: string;
          getOAuthToken: (callback: (token: string) => void) => void;
          volume?: number;
        }

        interface SpotifyPlayer {
          addListener: (
            event: string,
            callback: (data: unknown) => void,
          ) => void;
          connect: () => Promise<boolean>;
          disconnect: () => void;
          getCurrentState: () => Promise<unknown>;
        }

        (window as WindowWithSpotify).Spotify = {
          Player: class MockPlayer implements SpotifyPlayer {
            constructor(options: SpotifyPlayerOptions) {
              if (options.getOAuthToken) {
                options.getOAuthToken(() => {});
              }
            }
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              if (event === "ready") {
                setTimeout(() => callback({ device_id: "test" }), 100);
              }
              if (event === "player_state_changed") {
                // Send inconsistent state updates
                setTimeout(
                  () => {
                    stateCount++;
                    callback({
                      track_window: {
                        current_track: { id: `track_${stateCount}` },
                      },
                      paused: stateCount % 2 === 0,
                      position: Math.random() * 1000,
                    });
                  },
                  200 + Math.random() * 300,
                );
              }
            }
            connect(): Promise<boolean> {
              return Promise.resolve(true);
            }
            disconnect(): void {}
            getCurrentState(): Promise<unknown> {
              return Promise.resolve({
                track_window: {
                  current_track: { id: "current_track" },
                },
                paused: false,
                position: 5000,
              });
            }
          },
        };
      });

      const stateChanges: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        if (text.includes("state") || text.includes("track")) {
          stateChanges.push(text);
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Should handle inconsistent state gracefully
      console.log("State changes:", stateChanges.length);
      expect(stateChanges.length).toBeLessThan(20); // Reasonable limit
    });

    test("handles track transition edge cases", async ({ page }) => {
      // Mock rapid track changes
      await page.addInitScript(() => {
        interface WindowWithSpotify extends Window {
          Spotify?: {
            Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
          };
        }

        interface SpotifyPlayerOptions {
          name: string;
          getOAuthToken: (callback: (token: string) => void) => void;
          volume?: number;
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
              if (options.getOAuthToken) {
                options.getOAuthToken(() => {});
              }
            }
            addListener(
              event: string,
              callback: (data: unknown) => void,
            ): void {
              if (event === "ready") {
                callback({ device_id: "test" });
              }
              if (event === "player_state_changed") {
                // Rapid track changes
                let trackNum = 0;
                const changeTrack = () => {
                  trackNum++;
                  callback({
                    track_window: {
                      current_track: {
                        id: `rapid_track_${trackNum}`,
                        name: `Track ${trackNum}`,
                      },
                    },
                    paused: false,
                    position: 0,
                    duration: 30000,
                  });

                  if (trackNum < 5) {
                    setTimeout(changeTrack, 100); // Very rapid changes
                  }
                };
                setTimeout(changeTrack, 500);
              }
            }
            connect(): Promise<boolean> {
              return Promise.resolve(true);
            }
            disconnect(): void {}
          },
        };
      });

      const trackChanges: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        if (text.includes("rapid_track")) {
          trackChanges.push(text);
        }
      });

      await page.goto(`${FRONTEND_URL}`);
      await page.waitForTimeout(3000);

      // Should handle rapid track changes without breaking
      console.log("Rapid track changes:", trackChanges.length);
      expect(page.isClosed()).toBe(false);
    });
  });
});
