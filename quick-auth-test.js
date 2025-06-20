/**
 * Quick authentication test for debugging session issues
 * Paste this in browser console after authentication
 */

async function testAuth() {
  console.log("Testing authentication status...");

  try {
    // Test auth status
    const authResponse = await fetch("http://localhost:8000/auth/status", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    console.log("Auth status:", authResponse.status);
    const authData = await authResponse.json();
    console.log("Auth data:", authData);

    // Test queue endpoint
    const queueResponse = await fetch("http://localhost:8000/queue", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    console.log("Queue status:", queueResponse.status);
    if (queueResponse.ok) {
      const queueData = await queueResponse.json();
      console.log("Queue data:", queueData);
    } else {
      const errorText = await queueResponse.text();
      console.log("Queue error:", errorText);
    }

    // Check cookies
    console.log("Document cookies:", document.cookie);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run test
testAuth();
