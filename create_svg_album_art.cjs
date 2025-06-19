const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

console.log("🎨 Creating SVG data URI album art...");

// Color themes for different tracks
const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
  "#A3E4D7",
  "#FAD7A0",
  "#D5A6BD",
  "#AED6F1",
  "#A9DFBF",
  "#F9E79F",
  "#D2B4DE",
  "#AED6F1",
];

function createSVGDataURI(color, initials) {
  const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="${color}"/>
    <circle cx="200" cy="160" r="50" fill="rgba(255,255,255,0.3)"/>
    <polygon points="180,140 180,180 220,160" fill="rgba(255,255,255,0.6)"/>
    <text x="200" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white">${initials}</text>
    <text x="200" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="rgba(255,255,255,0.8)">♪ Album Art ♪</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

let updatedCount = 0;

// Update all tracks with SVG data URI album art
tracks.forEach((track, index) => {
  const color = colors[index % colors.length];
  const initials = track.title.substring(0, 2).toUpperCase();

  track.albumArt = createSVGDataURI(color, initials);
  updatedCount++;
  console.log(`✅ Updated ${track.title} - ${track.artist} (${initials})`);
});

// Write the updated tracks back to the file
fs.writeFileSync(tracksPath, JSON.stringify(tracks, null, 2));

console.log(`\n🎯 Updated ${updatedCount} tracks with SVG data URI album art`);
console.log(`📊 Total tracks: ${tracks.length}`);
