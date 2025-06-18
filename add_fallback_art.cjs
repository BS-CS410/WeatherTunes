const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

// Fallback album art for specific popular tracks
const fallbackAlbumArt = {
  "Anti-Hero":
    "https://upload.wikimedia.org/wikipedia/en/b/bb/Taylor_Swift_-_Midnights.png",
  "As It Was":
    "https://upload.wikimedia.org/wikipedia/en/8/82/Harry_Styles_-_Harry%27s_House.png",
  "Don't Start Now":
    "https://upload.wikimedia.org/wikipedia/en/8/84/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
  "Autumn Leaves":
    "https://upload.wikimedia.org/wikipedia/en/e/e3/Nat_King_Cole_Trio_1940s.jpg",
  "All I Want":
    "https://upload.wikimedia.org/wikipedia/en/f/f6/Kodaline_-_In_a_Perfect_World.png",
};

let updatesCount = 0;

// Add fallback URLs where needed
tracks.forEach((track) => {
  if (fallbackAlbumArt[track.title]) {
    // Add a fallback property
    track.albumArtFallback = fallbackAlbumArt[track.title];
    updatesCount++;
  }
});

// Write the updated tracks back to the file
fs.writeFileSync(tracksPath, JSON.stringify(tracks, null, 2));

console.log(`✅ Added fallback album art for ${updatesCount} tracks`);
console.log(`📊 Total tracks: ${tracks.length}`);
