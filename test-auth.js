/**
 * Simple test to debug authentication issues
 */

const BASE_URL = "http://localhost:8000";

async function testAuth() {
  console.log("🔐 Testing Authentication...\n");

  try {
    // Test auth session
    console.log("1️⃣ Testing auth session...");
    const authResponse = await fetch(`${BASE_URL}/auth/session`, {
      credentials: "include",
    });

    console.log(`Auth status: ${authResponse.status}`);
    if (authResponse.ok) {
      const authData = await authResponse.text();
      console.log(`Auth response: ${authData}`);
    }

    // Test queue endpoint specifically
    console.log("\n2️⃣ Testing queue endpoint directly...");
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
      const queueData = await queueResponse.text();
      console.log(`Queue response: ${queueData}`);
    }
  } catch (error) {
    console.error("❌ Auth test failed:", error.message);
  }
}

testAuth();
