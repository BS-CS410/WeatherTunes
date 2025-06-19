const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

console.log(
  "🎨 Replacing all album art URLs with reliable placeholder images...",
);

let updatedCount = 0;

// Update all tracks with reliable placeholder images
tracks.forEach((track, index) => {
  if (track.albumArt && track.albumArt.includes("scdn.co")) {
    // Create a unique, consistent image for each track
    const seed = index + 1;
    track.albumArt = `https://picsum.photos/400/400?random=${seed}`;
    updatedCount++;
    console.log(`✅ Updated ${track.title} - ${track.artist}`);
  }
});

// Write the updated tracks back to the file
fs.writeFileSync(tracksPath, JSON.stringify(tracks, null, 2));

console.log(`\n🎯 Updated ${updatedCount} tracks with reliable album art`);
console.log(`📊 Total tracks: ${tracks.length}`);
