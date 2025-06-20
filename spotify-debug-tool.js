/**
 * Step-by-step debugging for Spotify Web SDK initialization
 *
 * INSTRUCTIONS:
 * 1. Open the browser developer tools (F12)
 * 2. Go to the Console tab
 * 3. Copy and paste this entire script
 * 4. Follow the step-by-step instructions printed in the console
 */

console.log("🔧 SPOTIFY WEB SDK DEBUG TOOL");
console.log("=============================");
console.log("This will help diagnose player initialization timeout issues.");
console.log("");

// Step 1: Basic environment check
console.log("📋 STEP 1: Environment Check");
console.log("============================");

function checkEnvironment() {
  const checks = {
    "Spotify SDK loaded": !!window.Spotify,
    "SDK ready callback exists": !!window.onSpotifyWebPlaybackSDKReady,
    "Backend running": "unknown",
    "User authenticated": "unknown",
  };

  console.table(checks);

  if (!window.Spotify) {
    console.error(
      "❌ Spotify SDK not loaded. Check if the script tag is present in index.html",
    );
    return false;
  }

  console.log("✅ Basic environment checks passed");
  return true;
}

// Step 2: Authentication check
async function checkAuthentication() {
  console.log("\n📋 STEP 2: Authentication Check");
  console.log("===============================");

  try {
    const response = await fetch("http://localhost:5000/auth/status", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `❌ Auth status check failed: ${response.status} ${response.statusText}`,
      );
      return false;
    }

    const data = await response.json();
    console.log("Auth status response:", data);

    if (!data.authenticated) {
      console.error("❌ User not authenticated");
      console.log(
        "💡 Solution: Visit http://localhost:5000/auth/login to authenticate",
      );
      return false;
    }

    console.log("✅ User is authenticated");
    return true;
  } catch (error) {
    console.error("❌ Authentication check failed:", error);
    console.log("💡 Make sure the backend is running on port 5000");
    return false;
  }
}

// Step 3: Token retrieval check
async function checkTokenRetrieval() {
  console.log("\n📋 STEP 3: Token Retrieval Check");
  console.log("================================");

  try {
    const response = await fetch("http://localhost:5000/auth/token", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    console.log(`Token request status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Token retrieval failed: ${response.status} ${response.statusText}`,
      );
      console.error("Error details:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("✅ Token retrieved successfully");
    console.log(
      "Token expires at:",
      new Date(data.expires_at * 1000).toLocaleString(),
    );

    return data.access_token;
  } catch (error) {
    console.error("❌ Token retrieval failed:", error);
    return null;
  }
}

// Step 4: Manual player test
async function testPlayerCreation(token) {
  console.log("\n📋 STEP 4: Manual Player Creation");
  console.log("=================================");

  if (!token) {
    console.error("❌ No token available for player creation");
    return null;
  }

  console.log("🎮 Creating Spotify player...");

  const player = new window.Spotify.Player({
    name: "WeatherTunes Debug Player",
    getOAuthToken: (cb) => {
      console.log("🔄 SDK requesting token via callback");
      cb(token);
    },
    volume: 0.5,
  });

  // Add detailed listeners
  player.addListener("ready", ({ device_id }) => {
    console.log("✅ Player READY with device ID:", device_id);
    console.log("🎉 SUCCESS: Player initialization completed!");
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.log("⚠️ Player NOT READY:", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error("❌ INITIALIZATION ERROR:", message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error("❌ AUTHENTICATION ERROR:", message);
    console.log("💡 This might indicate token issues or missing scopes");
  });

  player.addListener("account_error", ({ message }) => {
    console.error("❌ ACCOUNT ERROR:", message);
    console.log("💡 This might indicate a Spotify Premium account is required");
  });

  player.addListener("playback_error", ({ message }) => {
    console.error("❌ PLAYBACK ERROR:", message);
  });

  console.log("🔌 Attempting to connect player...");
  console.log("⏳ This should complete within 10-15 seconds...");

  try {
    // Add timeout for debugging
    const connectPromise = player.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("🕒 Connection timeout after 20 seconds"));
      }, 20000);
    });

    const connected = await Promise.race([connectPromise, timeoutPromise]);

    if (connected) {
      console.log("✅ Player connected successfully!");
      return player;
    } else {
      console.error("❌ Player connection returned false");
      return null;
    }
  } catch (error) {
    console.error("❌ Player connection failed:", error.message);
    console.log("💡 Possible issues:");
    console.log("   - Network connectivity problems");
    console.log("   - Spotify API rate limiting");
    console.log("   - Invalid or expired token");
    console.log("   - Missing 'streaming' scope in OAuth");
    return null;
  }
}

// Main diagnostic function
async function runDiagnostics() {
  console.log("🚀 Starting comprehensive diagnostics...\n");

  // Step 1
  const envOk = checkEnvironment();
  if (!envOk) return;

  // Step 2
  const authOk = await checkAuthentication();
  if (!authOk) return;

  // Step 3
  const token = await checkTokenRetrieval();
  if (!token) return;

  // Step 4
  const player = await testPlayerCreation(token);

  if (player) {
    console.log("\n🎉 DIAGNOSTICS COMPLETED SUCCESSFULLY!");
    console.log("The player should now be ready to use.");
    console.log(
      "If you're still experiencing issues in the app, the problem might be:",
    );
    console.log("- Component re-rendering causing multiple initializations");
    console.log("- Race conditions in the React hooks");
    console.log("- Event listener setup timing");
  } else {
    console.log("\n❌ DIAGNOSTICS FAILED");
    console.log(
      "Please review the errors above and fix the identified issues.",
    );
  }
}

// Auto-run diagnostics
console.log("Starting automated diagnostics in 2 seconds...");
console.log("To run manually later, call: runDiagnostics()");

setTimeout(runDiagnostics, 2000);

// Export functions for manual testing
window.spotifyDebug = {
  runDiagnostics,
  checkEnvironment,
  checkAuthentication,
  checkTokenRetrieval,
  testPlayerCreation,
};
