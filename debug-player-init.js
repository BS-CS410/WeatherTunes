/**
 * Debug script for Spotify Web SDK player initialization
 * Copy and paste this into the browser console to debug step by step
 */

// Test 1: Check if SDK is loaded
console.log("=== Testing Spotify SDK Availability ===");
console.log("window.Spotify:", window.Spotify);
console.log(
  "window.onSpotifyWebPlaybackSDKReady:",
  window.onSpotifyWebPlaybackSDKReady,
);

// Test 2: Check token endpoint
console.log("\n=== Testing Token Endpoint ===");
async function testTokenEndpoint() {
  try {
    const response = await fetch("http://localhost:5000/auth/token", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Token response status:", response.status);
    console.log("Token response headers:", [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log("Token data:", data);
      return data.access_token;
    } else {
      const errorData = await response.text();
      console.error("Token error:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Token request failed:", error);
    return null;
  }
}

// Test 3: Manual player initialization
async function testPlayerInit() {
  console.log("\n=== Testing Player Initialization ===");

  if (!window.Spotify) {
    console.error("Spotify SDK not available");
    return;
  }

  const token = await testTokenEndpoint();
  if (!token) {
    console.error("No token available");
    return;
  }

  console.log("Creating player with token...");

  const player = new window.Spotify.Player({
    name: "Debug Player",
    getOAuthToken: (cb) => {
      console.log("SDK requesting token via callback");
      cb(token);
    },
    volume: 0.5,
  });

  // Add listeners
  player.addListener("ready", ({ device_id }) => {
    console.log("✅ Player ready with device ID:", device_id);
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.log("❌ Player not ready:", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error("❌ Initialization error:", message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error("❌ Authentication error:", message);
  });

  player.addListener("account_error", ({ message }) => {
    console.error("❌ Account error:", message);
  });

  console.log("Connecting player...");

  try {
    // Add timeout to connection
    const connectPromise = player.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Connection timeout after 15 seconds")),
        15000,
      );
    });

    const connected = await Promise.race([connectPromise, timeoutPromise]);
    console.log("Connection result:", connected);
    return player;
  } catch (error) {
    console.error("Connection failed:", error);
    return null;
  }
}

// Test 4: Check authentication status
async function testAuthStatus() {
  console.log("\n=== Testing Auth Status ===");
  try {
    const response = await fetch("http://localhost:5000/auth/status", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Auth status:", data);
    return data;
  } catch (error) {
    console.error("Auth status check failed:", error);
    return null;
  }
}

// Test 5: Check available devices
async function testDevices() {
  console.log("\n=== Testing Available Devices ===");
  try {
    const response = await fetch(
      "http://localhost:5000/spotify/player/devices",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Available devices:", data);
      return data;
    } else {
      const errorData = await response.text();
      console.error("Devices error:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Devices request failed:", error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  const authStatus = await testAuthStatus();

  if (!authStatus?.authenticated) {
    console.warn("⚠️ User not authenticated. Please log in first.");
    console.log("Visit: http://localhost:5000/auth/login");
    return;
  }

  await testDevices();
  const token = await testTokenEndpoint();
  if (token) {
    await testPlayerInit();
  }
}

// Export for manual testing
window.debugSpotify = {
  testTokenEndpoint,
  testPlayerInit,
  testAuthStatus,
  testDevices,
  runAllTests,
};

// Auto-run tests
console.log("Starting debug tests...");
runAllTests();
