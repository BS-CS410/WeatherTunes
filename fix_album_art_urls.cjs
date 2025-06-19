const fs = require("fs");
const path = require("path");

// Read the tracks.json file
const tracksPath = path.join(__dirname, "src", "lib", "tracks.json");
const tracks = JSON.parse(fs.readFileSync(tracksPath, "utf8"));

console.log(
  "🎨 Replacing Spotify CDN URLs with reliable placeholder images...",
);

// Map of reliable placeholder images for each track
const albumArtMap = {
  "6rqhFgbbKwnb9MLmUQDhG6": "https://picsum.photos/400/400?random=1&blur=1", // Pink Floyd
  "1tNJrcVe6gwLEiZCtprs1u": "https://picsum.photos/400/400?random=2&blur=1", // Dominic Fike
  "2takcwOaAZWiXQijPHIx7B": "https://picsum.photos/400/400?random=3&blur=1", // Muse
  "2TpxZ7JUBn3uw46aR7qd6V": "https://picsum.photos/400/400?random=4&blur=1", // Kodaline
  "4VqPOruhp5EdPBeR92t6lQ": "https://picsum.photos/400/400?random=5&blur=1", // Muse - Knights
  "4LRPiXqCikLlN15c3f9BdX": "https://picsum.photos/400/400?random=6&blur=1", // The Killers
  "39LLxExYz6ewLAcYrzQQyP": "https://picsum.photos/400/400?random=7&blur=1", // Dua Lipa - Levitating
  "7lEptt4wbM0yJTvSG5EBof": "https://picsum.photos/400/400?random=8&blur=1", // Tony Bennett
  "02MWAaffLxlfxAUY7c5dvx": "https://picsum.photos/400/400?random=9&blur=1", // Glass Animals
  "0tgVpDi06FyKpA1z0VMD4v": "https://picsum.photos/400/400?random=10&blur=1", // Ed Sheeran
  "6UelLqGlWMcVH1E5c4H7lY": "https://picsum.photos/400/400?random=11&blur=1", // Harry Styles - Watermelon
  "4Dvkj6JhhA12EX05fT7y2e": "https://picsum.photos/400/400?random=12&blur=1", // Harry Styles - As It Was
  "0eGsygTp906u18L0Oimnem": "https://picsum.photos/400/400?random=13&blur=1", // Taylor Swift
  "2EEeOnHehOozLq4aS0n6SL": "https://picsum.photos/400/400?random=14&blur=1", // The Neighbourhood
  "0OBJ3ou00vtWzpUOEmJTVu": "https://picsum.photos/400/400?random=15&blur=1", // Billie Holiday
  "4ZtFanR9U6ndgddUvNcjcG": "https://picsum.photos/400/400?random=16&blur=1", // Olivia Rodrigo
  "6WrI0LAC5M1Rw2MnX2ZvEg": "https://picsum.photos/400/400?random=17&blur=1", // Dua Lipa - Don't Start Now
  "5ChkMS8OtdzJeqyybCc9R5": "https://picsum.photos/400/400?random=18&blur=1", // Cigarettes After Sex
  "2WfaOiMkCvy7F5fcp2zZ8L": "https://picsum.photos/400/400?random=19&blur=1", // a-ha
  "1l6vOFiKLpkzKyUOXZ70W8": "https://picsum.photos/400/400?random=20&blur=1", // Miley Cyrus
  "1BxfuPKGuaTgP7aM0Bbdwr": "https://picsum.photos/400/400?random=21&blur=1", // Taylor Swift - Cruel Summer
  "5QO79kh1waicV47BqGRL3g": "https://picsum.photos/400/400?random=22&blur=1", // Nat King Cole
  "4KkLzvDW36GNQ0NLyzgOTo": "https://picsum.photos/400/400?random=23&blur=1", // The Weeknd
};

let updatedCount = 0;

// Update album art URLs
tracks.forEach((track) => {
  if (albumArtMap[track.id]) {
    track.albumArt = albumArtMap[track.id];
    updatedCount++;
    console.log(`✅ Updated ${track.title} - ${track.artist}`);
  }
});

// Write the updated tracks back to the file
fs.writeFileSync(tracksPath, JSON.stringify(tracks, null, 2));

console.log(`\n🎯 Updated ${updatedCount} tracks with reliable album art`);
console.log(`📊 Total tracks: ${tracks.length}`);
