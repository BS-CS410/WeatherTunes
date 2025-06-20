/**
 * Session Authentication Debug Tool
 * Copy and paste this into browser console to check session state
 */

console.log("🔍 SESSION AUTHENTICATION DEBUG");
console.log("=================================");

async function checkSessionAuth() {
  console.log("\n📋 Step 1: Check Auth Session");
  console.log("============================");

  try {
    const response = await fetch("http://localhost:8000/auth/session", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    console.log(`Auth session status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log("Auth session data:", data);

      if (data.authenticated) {
        console.log("✅ User is authenticated");
        return true;
      } else {
        console.log("❌ User not authenticated");
        return false;
      }
    } else {
      console.error(`❌ Auth session check failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Auth session check error:", error);
    return false;
  }
}

async function testQueueAccess() {
  console.log("\n📋 Step 2: Test Queue Access");
  console.log("============================");

  try {
    const response = await fetch("http://localhost:8000/queue", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    console.log(`Queue access status: ${response.status}`);
    console.log("Response headers:", [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Queue access successful:", data);
      return true;
    } else {
      const errorData = await response.text();
      console.error(
        `❌ Queue access failed: ${response.status} - ${errorData}`,
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Queue access error:", error);
    return false;
  }
}

async function checkCookies() {
  console.log("\n📋 Step 3: Check Browser Cookies");
  console.log("=================================");

  const cookies = document.cookie;
  console.log("All cookies:", cookies);

  const sessionCookie = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("session="));

  if (sessionCookie) {
    console.log("✅ Session cookie found:", sessionCookie.trim());
  } else {
    console.log("❌ No session cookie found");
  }
}

async function fullDiagnostic() {
  console.log("🚀 Starting full session diagnostic...\n");

  await checkCookies();
  const authOk = await checkSessionAuth();

  if (authOk) {
    await testQueueAccess();
  } else {
    console.log(
      "\n💡 Solution: Re-authenticate at http://localhost:8000/auth/login",
    );
  }

  console.log("\n🔧 If queue still fails after auth success:");
  console.log("- Check backend logs for session debug info");
  console.log("- Verify CORS credentials are working");
  console.log("- Clear browser cookies and re-authenticate");
}

// Export for manual testing
window.sessionDebug = {
  checkSessionAuth,
  testQueueAccess,
  checkCookies,
  fullDiagnostic,
};

// Auto-run
console.log("Starting session diagnostic in 2 seconds...");
setTimeout(fullDiagnostic, 2000);
