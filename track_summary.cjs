const fs = require('fs');
const tracks = JSON.parse(fs.readFileSync('./src/lib/tracks.json', 'utf8'));

console.log('=== UPDATED WEATHERTUNES PLAYLIST ===\n');

tracks.forEach((track, index) => {
  console.log(`${index + 1}. "${track.title}" by ${track.artist}`);
  console.log(`   Tags: ${track.tags.slice(0, 3).join(', ')}${track.tags.length > 3 ? '...' : ''}`);
  console.log('');
});

console.log(`Total tracks: ${tracks.length}`);

// Count by artist
const artistCounts = {};
tracks.forEach(track => {
  artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
});

console.log('\n=== ARTIST BREAKDOWN ===');
Object.entries(artistCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([artist, count]) => {
    console.log(`${artist}: ${count} track${count > 1 ? 's' : ''}`);
  });
