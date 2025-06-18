const fs = require('fs');
const tracks = JSON.parse(fs.readFileSync('./src/lib/tracks.json', 'utf8'));

console.log('Checking tracks for missing required fields...\n');

let tracksWithMissingFields = 0;
let tracksWithAllFields = 0;

tracks.forEach((track, index) => {
  const requiredFields = ['id', 'title', 'artist', 'albumArt'];
  const missingFields = requiredFields.filter(field => !track[field]);
  
  if (missingFields.length > 0) {
    tracksWithMissingFields++;
    console.log(`Track ${index + 1}: ID ${track.id}`);
    console.log(`  Missing fields: ${missingFields.join(', ')}`);
    console.log(`  Has fields: ${Object.keys(track).join(', ')}`);
    console.log('');
  } else {
    tracksWithAllFields++;
  }
});

console.log(`Summary:`);
console.log(`Total tracks: ${tracks.length}`);
console.log(`Tracks with all required fields: ${tracksWithAllFields}`);
console.log(`Tracks missing required fields: ${tracksWithMissingFields}`);
