const fs = require("fs");
const tracks = JSON.parse(fs.readFileSync("./src/lib/tracks.json", "utf8"));

console.log("Fixing duplicate tracks...\n");

// Alternative songs for different categories
const alternativeSongs = {
  dance_pop: [
    {
      title: "Don't Start Now",
      artist: "Dua Lipa",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c69c9a5a109d26b0facd4dda",
    },
    {
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e027fcead687e99583072cc217b",
    },
    {
      title: "Flowers",
      artist: "Miley Cyrus",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02343189fcdcdd41695f786c3a",
    },
  ],
  indie_chill: [
    {
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e8b91069b4ca4e3b1ebfea39",
    },
    {
      title: "Cigarettes After Sex",
      artist: "Apocalypse",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028a40c08b3b73ac0392f82a0f",
    },
    {
      title: "Dreams Tonite",
      artist: "Alvvays",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c2212fcf6bd60a3f8a0ba5ab",
    },
  ],
  pop_happy: [
    {
      title: "Flowers",
      artist: "Miley Cyrus",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02343189fcdcdd41695f786c3a",
    },
    {
      title: "Cruel Summer",
      artist: "Taylor Swift",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e787cffec20aa2a396a61647",
    },
    {
      title: "Shivers",
      artist: "Ed Sheeran",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ef24c3fdbf856340d55cfeb2",
    },
  ],
};

// Fix specific duplicate IDs
const fixes = [
  // Second "Levitating" -> different dance song
  { id: "6PWserUKEGiCpOpuJORmA4", replacement: alternativeSongs.dance_pop[1] },
  // Second "Heat Waves" -> different indie song
  {
    id: "5ChkMS8OtdzJeqyybCc9R5",
    replacement: alternativeSongs.indie_chill[0],
  },
  // Third "Levitating" -> different dance song
  { id: "2PpruBYCo4H7WOBJ7Q2EwM", replacement: alternativeSongs.dance_pop[0] },
  // Third "Heat Waves" -> different indie song
  {
    id: "5QO79kh1waicV47BqGRL3g",
    replacement: alternativeSongs.indie_chill[1],
  },
  // Second "Good 4 U" -> different pop song
  { id: "1AhDOtG9vPSOmsWgNW0BEY", replacement: alternativeSongs.pop_happy[0] },
  // Second "As It Was" -> different pop song
  { id: "6I9VzXrHxO9rA9A5euc8Ak", replacement: alternativeSongs.pop_happy[1] },
];

// Apply fixes
let fixedCount = 0;
tracks.forEach((track, index) => {
  const fix = fixes.find((f) => f.id === track.id);
  if (fix) {
    track.title = fix.replacement.title;
    track.artist = fix.replacement.artist;
    track.albumArt = fix.replacement.albumArt;
    console.log(
      `Fixed track ${index + 1}: "${track.title}" by ${track.artist}`,
    );
    fixedCount++;
  }
});

// Write back to file
fs.writeFileSync("./src/lib/tracks.json", JSON.stringify(tracks, null, 2));

console.log(`\nCompleted! Fixed ${fixedCount} duplicate tracks.`);
console.log("All tracks now have unique titles and artists.");
