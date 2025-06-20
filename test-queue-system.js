/**
 * Test script to verify the queue system works correctly
 */

const BASE_URL = "http://localhost:8000";

async function testQueueSystem() {
  console.log("🧪 Testing Queue System...\n");

  try {
    // Test 1: Get initial queue
    console.log("1️⃣ Testing initial queue fetch...");
    const queueResponse = await fetch(`${BASE_URL}/queue`, {
      credentials: "include",
    });

    if (queueResponse.ok) {
      const queueData = await queueResponse.json();
      console.log(
        `✅ Queue fetch successful: ${queueData.data?.queue?.length || 0} tracks`,
      );
    } else {
      console.log(`❌ Queue fetch failed: ${queueResponse.status}`);
      return;
    }

    // Test 2: Test queue replacement with sample tracks
    console.log("\n2️⃣ Testing queue replacement...");
    const sampleTracks = [
      {
        id: "test1",
        title: "Test Track 1",
        artist: "Test Artist 1",
        albumArt: "https://example.com/art1.jpg",
      },
      {
        id: "test2",
        title: "Test Track 2",
        artist: "Test Artist 2",
        albumArt: "https://example.com/art2.jpg",
      },
      {
        id: "test3",
        title: "Test Track 3",
        artist: "Test Artist 3",
        albumArt: "https://example.com/art3.jpg",
      },
    ];

    const replaceResponse = await fetch(`${BASE_URL}/queue/replace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ tracks: sampleTracks }),
    });

    if (replaceResponse.ok) {
      const replaceData = await replaceResponse.json();
      console.log(
        `✅ Queue replacement successful: ${replaceData.data?.queue?.length || 0} tracks`,
      );
    } else {
      console.log(`❌ Queue replacement failed: ${replaceResponse.status}`);
    }

    // Test 3: Test getting next track (this should trigger replenishment logic)
    console.log("\n3️⃣ Testing next track (skip simulation)...");
    const nextResponse = await fetch(`${BASE_URL}/queue/next`, {
      method: "POST",
      credentials: "include",
    });

    if (nextResponse.ok) {
      const nextData = await nextResponse.json();
      console.log(`✅ Next track successful:`);
      console.log(
        `   Current track: ${nextData.data?.currentTrack?.title || "None"}`,
      );
      console.log(
        `   Remaining queue: ${nextData.data?.queue?.length || 0} tracks`,
      );

      // Check if queue is low (should trigger replenishment in frontend)
      const remainingCount = nextData.data?.queue?.length || 0;
      if (remainingCount <= 3) {
        console.log(
          `📝 Queue is low (${remainingCount} tracks) - this should trigger automatic replenishment in frontend`,
        );
      }
    } else {
      console.log(`❌ Next track failed: ${nextResponse.status}`);
    }

    // Test 4: Final queue check
    console.log("\n4️⃣ Final queue state...");
    const finalResponse = await fetch(`${BASE_URL}/queue`, {
      credentials: "include",
    });

    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      console.log(
        `✅ Final queue: ${finalData.data?.queue?.length || 0} tracks`,
      );
    }

    console.log("\n🎉 Queue system test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testQueueSystem();
