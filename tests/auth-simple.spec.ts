import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://127.0.0.1:8000";
const FRONTEND_URL = "http://127.0.0.1:5173";

test.describe("Spotify OAuth Flow", () => {
  test("backend auth endpoints are accessible", async ({ page }) => {
    // Test 1: Health check
    const healthResponse = await page.request.get(`${BACKEND_URL}/health`);
    expect(healthResponse.status()).toBe(200);

    // Test 2: Session endpoint (unauthenticated)
    const sessionResponse = await page.request.get(
      `${BACKEND_URL}/auth/session`,
    );
    expect(sessionResponse.status()).toBe(200);
    const sessionData = await sessionResponse.json();
    expect(sessionData.authenticated).toBe(false);

    // Test 3: Login redirect
    const loginResponse = await page.request.get(`${BACKEND_URL}/auth/login`, {
      maxRedirects: 0,
    });
    expect([302, 307]).toContain(loginResponse.status());
    const location = loginResponse.headers()["location"];
    expect(location).toContain("accounts.spotify.com");
  });

  test("frontend login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();

    // Look for login button or form
    const hasLoginButton = await page
      .getByRole("button", { name: /login|sign in/i })
      .isVisible({ timeout: 3000 });
    const hasLoginLink = await page
      .getByRole("link", { name: /login|sign in/i })
      .isVisible({ timeout: 3000 });

    expect(hasLoginButton || hasLoginLink).toBe(true);
  });

  test("token endpoint requires authentication", async ({ page }) => {
    const response = await page.request.get(`${BACKEND_URL}/auth/token`);
    expect(response.status()).toBe(401);

    const errorData = await response.json();
    expect(errorData.error).toContain("Not authenticated");
  });

  test("callback handles missing code parameter", async ({ page }) => {
    const response = await page.request.get(`${BACKEND_URL}/auth/callback`, {
      maxRedirects: 0,
    });

    expect([302, 307]).toContain(response.status());

    const location = response.headers()["location"];
    expect(location).toContain(FRONTEND_URL);
    expect(location).toContain("error=missing_code");
  });
});

test.describe("Backend Health Checks", () => {
  test("backend is running", async ({ page }) => {
    const response = await page.request.get(`${BACKEND_URL}/health`);
    expect(response.status()).toBe(200);

    const healthData = await response.json();
    expect(healthData.status).toBe("healthy");
    expect(healthData.service).toBe("WeatherTunes Backend");
  });

  test("CORS headers are present", async ({ page }) => {
    const response = await page.request.get(`${BACKEND_URL}/health`);
    const headers = response.headers();

    // Check if CORS headers exist (they may be lowercase)
    const corsOrigin =
      headers["access-control-allow-origin"] ||
      headers["Access-Control-Allow-Origin"];
    const corsCredentials =
      headers["access-control-allow-credentials"] ||
      headers["Access-Control-Allow-Credentials"];

    // Backend should always return CORS headers with our fix
    expect(response.status()).toBe(200);
    expect(corsOrigin).toBeTruthy();
    expect(corsCredentials).toBe("true");

    // Also test on session endpoint
    const sessionResponse = await page.request.get(
      `${BACKEND_URL}/auth/session`,
    );
    const sessionHeaders = sessionResponse.headers();

    const sessionCorsOrigin =
      sessionHeaders["access-control-allow-origin"] ||
      sessionHeaders["Access-Control-Allow-Origin"];
    const sessionCorsCredentials =
      sessionHeaders["access-control-allow-credentials"] ||
      sessionHeaders["Access-Control-Allow-Credentials"];

    expect(sessionResponse.status()).toBe(200);
    expect(sessionCorsOrigin).toBeTruthy();
    expect(sessionCorsCredentials).toBe("true");
  });
});
