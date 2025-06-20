/**
 * Quick authentication debugging tool
 * Run this in the browser console to debug auth issues
 */

console.log("🔍 QUICK AUTH DEBUG");
console.log("==================");

// Check if we're on the right page
console.log("Current URL:", window.location.href);

// Check for auth cookies
const cookies = document.cookie.split(";").reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split("=");
  acc[key] = value;
  return acc;
}, {});

console.log("Cookies:", cookies);

// Check local storage
console.log("Local Storage:");
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`  ${key}: ${localStorage.getItem(key)}`);
}

// Test auth endpoint
async function testAuth() {
  try {
    console.log("\n🔍 Testing auth status...");
    const response = await fetch("http://localhost:8000/auth/status", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Auth Status Response:", response.status);
    const data = await response.json();
    console.log("Auth Data:", data);

    if (response.status === 200) {
      console.log("✅ User is authenticated");
    } else {
      console.log("❌ User is not authenticated");
    }
  } catch (error) {
    console.error("Auth test failed:", error);
  }
}

// Test queue endpoint
async function testQueue() {
  try {
    console.log("\n🔍 Testing queue access...");
    const response = await fetch("http://localhost:8000/queue", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Queue Response:", response.status);
    const data = await response.json();
    console.log("Queue Data:", data);

    if (response.status === 200) {
      console.log("✅ Queue access successful");
    } else {
      console.log("❌ Queue access failed");
    }
  } catch (error) {
    console.error("Queue test failed:", error);
  }
}

// Run tests
testAuth();
testQueue();

// Make available in console
window.quickAuthDebug = {
  testAuth,
  testQueue,
  cookies,
  localStorage: Object.fromEntries(
    Array.from({ length: localStorage.length }, (_, i) => {
      const key = localStorage.key(i);
      return [key, localStorage.getItem(key)];
    }),
  ),
};

console.log("\n✨ Debug tools available as window.quickAuthDebug");
