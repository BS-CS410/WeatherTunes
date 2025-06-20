#!/usr/bin/env node

/**
 * Test script to verify that the queue always maintains a fixed size
 * Simulates track removal and checks immediate replenishment behavior
 */

const BASE_URL = "http://localhost:8000";
const TARGET_QUEUE_SIZE = 12;

// Mock track data for testing
const mockTracks = [
  {
    id: "test1",
    title: "Test Track 1",
    artist: "Test Artist 1",
    album: "Test Album 1",
    duration: 180000,
    preview_url: null,
    external_urls: { spotify: "https://open.spotify.com/track/test1" },
    uri: "spotify:track:test1",
  },
  {
    id: "test2",
    title: "Test Track 2",
    artist: "Test Artist 2",
    album: "Test Album 2",
    duration: 200000,
    preview_url: null,
    external_urls: { spotify: "https://open.spotify.com/track/test2" },
    uri: "spotify:track:test2",
  },
];

/**
 * Get current queue from backend
 */
async function getQueue() {
  try {
    const response = await fetch(`${BASE_URL}/queue`);
    const data = await response.json();
    return data.queue || [];
  } catch (error) {
    console.error("Failed to get queue:", error.message);
    return [];
  }
}

/**
 * Replace queue with test tracks
 */
async function setTestQueue(tracks) {
  try {
    const response = await fetch(`${BASE_URL}/queue/replace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks: tracks }),
    });
    const data = await response.json();
    console.log(`✓ Queue set with ${tracks.length} tracks`);
    return data.queue || tracks;
  } catch (error) {
    console.error("Failed to set test queue:", error.message);
    return [];
  }
}

/**
 * Simulate advancing to next track (removes current track from queue)
 */
async function nextTrack() {
  try {
    const response = await fetch(`${BASE_URL}/queue/next`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Advanced to next track");
    return data.queue || [];
  } catch (error) {
    console.error("Failed to advance track:", error.message);
    return [];
  }
}

/**
 * Test fixed queue size behavior
 */
async function testFixedQueueSize() {
  console.log("🧪 Testing Fixed Queue Size Behavior\n");

  try {
    // Step 1: Set up initial queue with target size
    console.log(`1. Setting up queue with ${TARGET_QUEUE_SIZE} tracks...`);
    const initialTracks = Array.from({ length: TARGET_QUEUE_SIZE }, (_, i) => ({
      ...mockTracks[i % mockTracks.length],
      id: `test${i + 1}`,
      title: `Test Track ${i + 1}`,
    }));

    let queue = await setTestQueue(initialTracks);
    console.log(`   Queue size: ${queue.length}/${TARGET_QUEUE_SIZE}\n`);

    // Step 2: Remove tracks one by one and check replenishment
    console.log("2. Testing track removal and immediate replenishment...");
    for (let i = 0; i < 5; i++) {
      console.log(`   Test ${i + 1}: Removing track from queue...`);

      // Get queue size before removal
      const beforeQueue = await getQueue();
      console.log(`   Before removal: ${beforeQueue.length} tracks`);

      // Remove track (simulate next track)
      queue = await nextTrack();
      console.log(`   After removal: ${queue.length} tracks`);

      // Wait a moment for replenishment to trigger
      console.log("   Waiting for replenishment...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check final queue size
      const finalQueue = await getQueue();
      console.log(`   Final queue size: ${finalQueue.length} tracks`);

      if (finalQueue.length === TARGET_QUEUE_SIZE) {
        console.log(
          `   ✅ PASS: Queue maintained target size (${TARGET_QUEUE_SIZE})`,
        );
      } else {
        console.log(
          `   ❌ FAIL: Queue size is ${finalQueue.length}, expected ${TARGET_QUEUE_SIZE}`,
        );
      }
      console.log("");
    }

    // Step 3: Rapid track removal test
    console.log("3. Testing rapid track removal...");
    console.log("   Removing 3 tracks rapidly...");

    const beforeRapid = await getQueue();
    console.log(`   Before rapid removal: ${beforeRapid.length} tracks`);

    // Remove 3 tracks quickly
    for (let i = 0; i < 3; i++) {
      await nextTrack();
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
    }

    const afterRapid = await getQueue();
    console.log(`   After rapid removal: ${afterRapid.length} tracks`);

    // Wait for replenishment
    console.log("   Waiting for replenishment...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const finalRapid = await getQueue();
    console.log(`   Final queue size: ${finalRapid.length} tracks`);

    if (finalRapid.length === TARGET_QUEUE_SIZE) {
      console.log(
        `   ✅ PASS: Queue recovered to target size (${TARGET_QUEUE_SIZE})`,
      );
    } else {
      console.log(
        `   ❌ FAIL: Queue size is ${finalRapid.length}, expected ${TARGET_QUEUE_SIZE}`,
      );
    }

    console.log("\n🎉 Fixed queue size test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testFixedQueueSize();

export { testFixedQueueSize };
