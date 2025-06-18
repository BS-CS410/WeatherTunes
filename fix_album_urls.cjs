const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

let updatesCount = 0;

// Update all album art URLs to use i.scdn.co format
tracks.forEach((track) => {
  if (
    track.albumArt &&
    track.albumArt.includes("image-cdn-ak.spotifycdn.com")
  ) {
    // Extract the image ID from the URL
    const imageIdMatch = track.albumArt.match(/ab67616d\w+/);
    if (imageIdMatch) {
      const imageId = imageIdMatch[0];
      // Convert to the more reliable i.scdn.co format
      track.albumArt = `https://i.scdn.co/image/${imageId}`;
      updatesCount++;
    }
  } else if (
    track.albumArt &&
    track.albumArt.includes("image-cdn-fa.spotifycdn.com")
  ) {
    // Extract the image ID from the URL
    const imageIdMatch = track.albumArt.match(/ab67616d\w+/);
    if (imageIdMatch) {
      const imageId = imageIdMatch[0];
      // Convert to the more reliable i.scdn.co format
      track.albumArt = `https://i.scdn.co/image/${imageId}`;
      updatesCount++;
    }
  }
});

// Write the updated tracks back to the file
fs.writeFileSync(tracksPath, JSON.stringify(tracks, null, 2));

console.log(
  `✅ Updated ${updatesCount} album art URLs to use i.scdn.co format`,
);
console.log(`📊 Total tracks: ${tracks.length}`);
