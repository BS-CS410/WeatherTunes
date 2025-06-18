const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

console.log("🎵 Album Art Verification Report");
console.log("=================================");

let hasAlbumArt = 0;
let hasFallback = 0;
let missingArt = 0;

tracks.forEach((track) => {
  const hasArt = !!track.albumArt;
  const hasFallbackArt = !!track.albumArtFallback;

  if (hasArt) hasAlbumArt++;
  if (hasFallbackArt) hasFallback++;
  if (!hasArt && !hasFallbackArt) missingArt++;

  console.log(`📀 ${track.title} - ${track.artist}`);
  console.log(`   Album Art: ${hasArt ? "✅" : "❌"}`);
  console.log(`   Fallback:  ${hasFallbackArt ? "✅" : "❌"}`);
  if (hasArt) {
    console.log(`   URL: ${track.albumArt.substring(0, 50)}...`);
  }
  console.log("");
});

console.log("📊 Summary:");
console.log(`   Total tracks: ${tracks.length}`);
console.log(`   With album art: ${hasAlbumArt}`);
console.log(`   With fallback: ${hasFallback}`);
console.log(`   Missing art: ${missingArt}`);

if (missingArt === 0) {
  console.log("✅ All tracks have album art or fallback!");
} else {
  console.log(`⚠️  ${missingArt} tracks are missing album art`);
}
