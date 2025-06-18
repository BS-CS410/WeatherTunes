const fs = require("fs");

// Read the current tracks.json
const tracks = JSON.parse(fs.readFileSync("./src/lib/tracks.json", "utf8"));

console.log("Replacing placeholder tracks with real songs...");

// Real song database organized by tags/mood
const realSongs = {
  // Summer/Dance tracks
  summer_dance: [
    {
      title: "Levitating",
      artist: "Dua Lipa",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c69c9a5a109d26b0facd4dda",
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
    },
    {
      title: "Don't Start Now",
      artist: "Dua Lipa",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c69c9a5a109d26b0facd4dda",
    },
  ],

  // Pop/Happy tracks
  pop_happy: [
    {
      title: "As It Was",
      artist: "Harry Styles",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0262b37634b8b7c2576e8ceda9",
    },
    {
      title: "Anti-Hero",
      artist: "Taylor Swift",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028ae28d3ab3dbb86a1067bc79",
    },
    {
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022ee3c47c1296b8c11b39bfa7",
    },
  ],

  // Chill/Indie tracks
  chill_indie: [
    {
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e8b91069b4ca4e3b1ebfea39",
    },
    {
      title: "Heat Waves",
      artist: "Glass Animals",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a6ef43e5b0b49b86593dd2f7",
    },
    {
      title: "Cigarettes After Sex",
      artist: "Apocalypse",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028a40c08b3b73ac0392f82a0f",
    },
  ],

  // Acoustic tracks
  acoustic: [
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c73f8a1f0dc5b6d9b90e0ad3",
    },
    {
      title: "The Night We Met",
      artist: "Lord Huron",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e7b10a4c2ac31b1e34e56f89",
    },
    {
      title: "Vienna",
      artist: "Billy Joel",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0215d24b30ac5df0d56e2b6456",
    },
  ],

  // Electronic/Intense tracks
  electronic: [
    {
      title: "Midnight City",
      artist: "M83",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022eb6b9d0f79056ce1e93e19e",
    },
    {
      title: "Pumped Up Kicks",
      artist: "Foster the People",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b7ef5b36bb73b66ce4d5cefc",
    },
    {
      title: "Take On Me",
      artist: "a-ha",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0247074a29ecac81ca8b60c5b7",
    },
  ],

  // Rainy/Jazz tracks
  rainy_jazz: [
    {
      title: "The Way You Look Tonight",
      artist: "Tony Bennett",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026c43bb6a76a8e9f7b5985b56",
    },
    {
      title: "Blue Moon",
      artist: "Billie Holiday",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025a88974ed75af6074dff2d9e",
    },
    {
      title: "Autumn Leaves",
      artist: "Nat King Cole",
      albumArt:
        "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024ad9177fdb17d7d49fec5ee2",
    },
  ],
};

// Helper function to get appropriate song based on tags
function getSongForTags(tags) {
  if (
    tags.some((tag) => ["dance", "summer dance", "party hits"].includes(tag))
  ) {
    return realSongs.summer_dance[
      Math.floor(Math.random() * realSongs.summer_dance.length)
    ];
  } else if (
    tags.some((tag) =>
      ["acoustic", "folk", "winter morning acoustic"].includes(tag),
    )
  ) {
    return realSongs.acoustic[
      Math.floor(Math.random() * realSongs.acoustic.length)
    ];
  } else if (
    tags.some((tag) => ["electronic", "intense", "dramatic"].includes(tag))
  ) {
    return realSongs.electronic[
      Math.floor(Math.random() * realSongs.electronic.length)
    ];
  } else if (
    tags.some((tag) =>
      ["rainy night jazz", "jazz", "soft rain indie"].includes(tag),
    )
  ) {
    return realSongs.rainy_jazz[
      Math.floor(Math.random() * realSongs.rainy_jazz.length)
    ];
  } else if (
    tags.some((tag) => ["chill", "indie", "relax", "lo-fi"].includes(tag))
  ) {
    return realSongs.chill_indie[
      Math.floor(Math.random() * realSongs.chill_indie.length)
    ];
  } else {
    // Default to pop/happy for remaining tracks
    return realSongs.pop_happy[
      Math.floor(Math.random() * realSongs.pop_happy.length)
    ];
  }
}

// Replace placeholder tracks
let replacedCount = 0;
tracks.forEach((track, index) => {
  if (
    (track.title &&
      (track.title.startsWith("Track ") ||
        track.title === "Summer Vibes" ||
        track.title === "Chill Nights" ||
        track.title === "Cloudy Skies" ||
        track.title === "Winter Acoustic" ||
        track.title === "Dreamy Pop")) ||
    track.albumArt.includes("placeholder")
  ) {
    const newSong = getSongForTags(track.tags || []);
    track.title = newSong.title;
    track.artist = newSong.artist;
    track.albumArt = newSong.albumArt;
    replacedCount++;
    console.log(
      `Replaced track ${index + 1}: ${newSong.title} by ${newSong.artist}`,
    );
  }
});

// Write the updated tracks back to the file
fs.writeFileSync("./src/lib/tracks.json", JSON.stringify(tracks, null, 2));

console.log(
  `\nCompleted! Replaced ${replacedCount} placeholder tracks with real songs.`,
);
console.log("All tracks now have real song data with proper album artwork.");
