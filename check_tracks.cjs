const fs = require('fs');
const tracks = JSON.parse(fs.readFileSync('./src/lib/tracks.json', 'utf8'));

console.log('Total tracks:', tracks.length);

const tracksWithoutTags = tracks.filter(track => !track.tags || track.tags.length === 0);
console.log('Tracks without tags:', tracksWithoutTags.length);

if (tracksWithoutTags.length > 0) {
  console.log('Tracks missing tags:');
  tracksWithoutTags.forEach(track => console.log('- ID:', track.id, 'Title:', track.title));
}

const tracksWithTags = tracks.filter(track => track.tags && track.tags.length > 0);
console.log('Tracks with tags:', tracksWithTags.length);

// Check for common tag combinations
const allTags = new Set();
tracks.forEach(track => {
  if (track.tags) {
    track.tags.forEach(tag => allTags.add(tag));
  }
});
console.log('Total unique tags:', allTags.size);
console.log('Sample tags:', Array.from(allTags).slice(0, 10));
