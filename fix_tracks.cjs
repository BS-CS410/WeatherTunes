const fs = require("fs");

// Read the current tracks.json
const tracks = JSON.parse(fs.readFileSync("./src/lib/tracks.json", "utf8"));

console.log("Adding missing metadata to tracks...");

// Add missing fields to tracks that don't have them
tracks.forEach((track, index) => {
  if (!track.title) {
    track.title = `Track ${String(index + 1).padStart(2, "0")}`;
  }
  if (!track.artist) {
    // Generate artist names based on tags
    if (track.tags) {
      if (track.tags.includes("dance") || track.tags.includes("electronic")) {
        track.artist = "Electronic Artist";
      } else if (
        track.tags.includes("acoustic") ||
        track.tags.includes("folk")
      ) {
        track.artist = "Acoustic Artist";
      } else if (track.tags.includes("indie")) {
        track.artist = "Indie Artist";
      } else if (track.tags.includes("pop")) {
        track.artist = "Pop Artist";
      } else if (track.tags.includes("jazz")) {
        track.artist = "Jazz Artist";
      } else if (track.tags.includes("chill") || track.tags.includes("lo-fi")) {
        track.artist = "Chill Artist";
      } else {
        track.artist = "Various Artist";
      }
    } else {
      track.artist = "Unknown Artist";
    }
  }
  if (!track.albumArt) {
    track.albumArt = `https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02placeholder${index + 1}.jpg`;
  }
});

// Write the updated tracks back to the file
fs.writeFileSync("./src/lib/tracks.json", JSON.stringify(tracks, null, 2));

console.log(`Updated ${tracks.length} tracks with missing metadata.`);

// Verify the changes
const requiredFields = ["id", "title", "artist", "albumArt"];
let missingCount = 0;

tracks.forEach((track, index) => {
  const missing = requiredFields.filter((field) => !track[field]);
  if (missing.length > 0) {
    console.log(`Track ${index + 1} still missing: ${missing.join(", ")}`);
    missingCount++;
  }
});

console.log(
  `Verification: ${missingCount} tracks still have missing required fields.`,
);
