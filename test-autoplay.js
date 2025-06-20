#!/usr/bin/env node

/**
 * Test autoplay functionality for Spotify embeds
 * Verifies that the autoplay parameter is correctly added to Spotify embed URLs
 */

const fs = require("fs");
const path = require("path");

console.log("🎵 Testing Spotify Embed Autoplay Implementation\n");

// File paths to check
const filesToCheck = [
  "/Users/sirel/Desktop/weathertunes/src/components/shared/WeatherMusicCard.tsx",
  "/Users/sirel/Desktop/weathertunes/src/components/music/FavoritesCard.tsx",
];

let allTestsPassed = true;

filesToCheck.forEach((filePath) => {
  const fileName = path.basename(filePath);

  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Check for autoplay parameter in Spotify embed URLs
    const spotifyEmbedRegex =
      /https:\/\/open\.spotify\.com\/embed\/track\/[^"]+/g;
    const embedUrls = content.match(spotifyEmbedRegex) || [];

    console.log(`📋 Checking ${fileName}:`);

    if (embedUrls.length === 0) {
      console.log("   ⚠️  No Spotify embed URLs found");
    } else {
      embedUrls.forEach((url, index) => {
        const hasAutoplay = url.includes("autoplay=1");
        const urlDisplay = url.length > 60 ? url.substring(0, 60) + "..." : url;

        console.log(`   📺 Embed ${index + 1}: ${urlDisplay}`);
        console.log(
          `   🎬 Autoplay enabled: ${hasAutoplay ? "✅ YES" : "❌ NO"}`,
        );

        if (!hasAutoplay) {
          allTestsPassed = false;
        }
      });
    }

    console.log("");
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}\n`);
    allTestsPassed = false;
  }
});

// Summary
console.log("=".repeat(50));
if (allTestsPassed) {
  console.log("✅ All Spotify embeds have autoplay enabled!");
  console.log(
    "🎵 Music will start playing automatically when tracks are loaded",
  );
} else {
  console.log("❌ Some Spotify embeds are missing autoplay parameter");
  console.log("🔧 Please review and update the embed URLs");
}

console.log("\n📝 Note: Autoplay behavior may still depend on:");
console.log("   • User browser settings and autoplay policies");
console.log("   • Spotify user account and premium status");
console.log("   • User interaction requirements for autoplay");
