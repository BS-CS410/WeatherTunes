// Quick test to verify trackMetadata.json is properly formatted
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const metadataPath = path.join(__dirname, "src/lib/trackMetadata.json");
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

console.log("Total tracks in metadata:", metadata.length);
console.log("First few tracks:");
metadata.slice(0, 3).forEach((track) => {
  console.log(`  ${track.id}: "${track.title}" by "${track.artist}"`);
});

// Check for specific sample queue tracks
const sampleTracks = [
  "2TpxZ7JUBn3uw46aR7qd6V",
  "7ouMYWpwJ422jRcDASZB7P",
  "1lDWb6b6ieDQ2xT7ewTC3G",
];
console.log("\nSample queue tracks:");
sampleTracks.forEach((id) => {
  const track = metadata.find((t) => t.id === id);
  if (track) {
    console.log(`  ✓ ${id}: "${track.title}" by "${track.artist}"`);
  } else {
    console.log(`  ✗ ${id}: NOT FOUND`);
  }
});
