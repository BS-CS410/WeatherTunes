/**
 * Test the fixed authentication flow
 */

const BASE_URL = "http://127.0.0.1:8000";

async function testAuthFlow() {
  console.log("🔐 Testing Fixed Authentication Flow...\n");

  try {
    // Test 1: Check initial session state
    console.log("1️⃣ Testing initial session state...");
    const sessionResponse = await fetch(`${BASE_URL}/auth/session`, {
      credentials: "include",
    });

    console.log(`Session status: ${sessionResponse.status}`);
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log(`Session data:`, sessionData);
    }

    // Test 2: Check if we can access protected endpoint
    console.log("\n2️⃣ Testing protected endpoint access...");
    const queueResponse = await fetch(`${BASE_URL}/queue`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Queue status: ${queueResponse.status}`);
    if (!queueResponse.ok) {
      const errorText = await queueResponse.text();
      console.log(`Queue error: ${errorText}`);
    } else {
      const queueData = await queueResponse.json();
      console.log(`Queue data:`, queueData);
    }

    // Test 3: Show cookies
    console.log("\n3️⃣ Current browser cookies:");
    console.log(`Cookies: ${document.cookie || "(none)"}`);

    // Instructions
    console.log("\n📝 Next Steps:");
    if (queueResponse.status === 401) {
      console.log("❌ Not authenticated. Please:");
      console.log("1. Go to: http://127.0.0.1:8000/auth/login");
      console.log("2. Complete Spotify OAuth");
      console.log("3. You should be redirected back to the app");
      console.log("4. Run this test again");
    } else {
      console.log("✅ Authentication working!");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Export for console use
window.testAuthFlow = testAuthFlow;

// Auto-run
testAuthFlow();
