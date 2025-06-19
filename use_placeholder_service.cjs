const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

console.log("🎨 Using placeholder.com for reliable album art...");

// Color themes for different music genres/moods
const colorThemes = [
  "4A90E2", // Blue
  "F39C12", // Orange
  "E74C3C", // Red
  "9B59B6", // Purple
  "1ABC9C", // Teal
  "27AE60", // Green
  "E67E22", // Dark Orange
  "3498DB", // Light Blue
  "E91E63", // Pink
  "795548", // Brown
  "607D8B", // Blue Grey
  "FF9800", // Amber
  "8BC34A", // Light Green
  "CDDC39", // Lime
  "FFC107", // Yellow
  "009688", // Cyan
  "673AB7", // Deep Purple
  "FF5722", // Deep Orange
  "2196F3", // Blue
  "4CAF50", // Green
  "FFEB3B", // Yellow
  "00BCD4", // Light Blue
  "FF4081", // Pink Accent
];

let updatedCount = 0;

// Update all tracks with reliable placeholder images using different colors
tracks.forEach((track, index) => {
  const colorIndex = index % colorThemes.length;
  const color = colorThemes[colorIndex];

  // Use placeholder.com which is more reliable
  track.albumArt = `https://via.placeholder.com/400x400/${color}/FFFFFF?text=${encodeURIComponent(track.title.substring(0, 2).toUpperCase())}`;
  updatedCount++;
  console.log(`✅ Updated ${track.title} - ${track.artist} (Color: #${color})`);
});

// Write the updated tracks back to the file
fs.writeFileSync(tracksPath, JSON.stringify(tracks, null, 2));

console.log(
  `\n🎯 Updated ${updatedCount} tracks with reliable placeholder album art`,
);
console.log(`📊 Total tracks: ${tracks.length}`);
