// Test script to check what tracks are being generated
// Run this in the browser console on the homepage

function testQueueGeneration() {
  console.log("🧪 Testing queue generation...");

  // Get the current queue
  const queue = window.trackQueue || [];
  console.log("Current queue length:", queue.length);

  if (queue.length > 0) {
    console.log("\nFirst few tracks:");
    queue.slice(0, 3).forEach((track, i) => {
      console.log(`\n${i + 1}. Track:`, {
        id: track.id,
        title: track.title,
        artist: track.artist,
        albumArt: track.albumArt
          ? `Present (${track.albumArt.length} chars)`
          : "MISSING",
        albumArtPreview: track.albumArt
          ? track.albumArt.substring(0, 100) + "..."
          : "None",
      });
    });
  } else {
    console.log("❌ No tracks in queue");
  }

  // Test if it's fallback tracks (these would be hardcoded)
  const firstTrack = queue[0];
  if (firstTrack) {
    const hardcodedIds = [
      "4iV5W9uYEdYUVa79Axb7Rh",
      "1BxfuPKGuaTgP7aM0Bbdwr",
      "3n3Ppam7vgaVa1iaRUc9Lp",
    ];
    if (hardcodedIds.includes(firstTrack.id)) {
      console.log("⚠️  WARNING: Queue contains hardcoded fallback tracks!");
    } else {
      console.log("✅ Queue appears to contain dynamic Spotify tracks");
    }
  }
}

testQueueGeneration();
