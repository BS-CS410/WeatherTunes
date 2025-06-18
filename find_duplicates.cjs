const fs = require('fs');
const tracks = JSON.parse(fs.readFileSync('./src/lib/tracks.json', 'utf8'));

console.log('Checking for duplicate songs...\n');

const seenTracks = new Map();
const duplicates = [];

tracks.forEach((track, index) => {
  const key = `${track.title} by ${track.artist}`;
  if (seenTracks.has(key)) {
    duplicates.push({
      title: track.title,
      artist: track.artist,
      indices: [seenTracks.get(key), index + 1],
      ids: [tracks[seenTracks.get(key) - 1].id, track.id]
    });
  } else {
    seenTracks.set(key, index + 1);
  }
});

if (duplicates.length > 0) {
  console.log('Found duplicates:');
  duplicates.forEach(dup => {
    console.log(`"${dup.title}" by ${dup.artist}`);
    console.log(`  Positions: ${dup.indices.join(' and ')}`);
    console.log(`  IDs: ${dup.ids.join(' and ')}`);
    console.log('');
  });
} else {
  console.log('No duplicates found! ✅');
}

console.log(`Total tracks: ${tracks.length}`);
