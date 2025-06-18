import { QueueManager } from "./src/lib/queueManager.js";
import { TracksManager } from "./src/lib/tracksManager.js";
import { WeatherMusicService } from "./src/lib/weatherMusicService.js";

console.log("=== Testing Playlist Generation ===");

// Test 1: Basic queue generation
console.log("\n1. Testing basic weather queue generation:");
const weatherQueue = QueueManager.generateWeatherQueue("sunny", 5);
console.log("Sunny weather queue:", weatherQueue);

// Test 2: Tags-based generation
console.log("\n2. Testing mood queue generation:");
const moodQueue = QueueManager.generateMoodQueue(["pop", "happy"], 5);
console.log("Pop & Happy mood queue:", moodQueue);

// Test 3: Weather-based playlist
console.log("\n3. Testing weather music service:");
const weatherBasedQueue = WeatherMusicService.generateWeatherBasedQueue(
  25,
  "sunny",
  "afternoon",
  5,
);
console.log("Weather-based queue (25°C, sunny, afternoon):", weatherBasedQueue);

// Test 4: Check specific weather conditions
console.log("\n4. Testing various weather conditions:");
const conditions = ["sunny", "rainy", "cloudy", "snowy"];
conditions.forEach((condition) => {
  const tracks = TracksManager.getTracksForWeather(condition);
  console.log(`${condition}: ${tracks.length} tracks found`);
  if (tracks.length > 0) {
    console.log(`  Sample: ${tracks[0].title} by ${tracks[0].artist}`);
  }
});

// Test 5: Tag matching analysis
console.log("\n5. Testing tag matching:");
const allTracks = TracksManager.getAllTracks();
console.log(`Total tracks: ${allTracks.length}`);

const tracksWithSunnyTag = TracksManager.getTracksByTags(["sunny"]);
console.log(`Tracks with "sunny" tag: ${tracksWithSunnyTag.length}`);

const tracksWithRainyTag = TracksManager.getTracksByTags(["rainy"]);
console.log(`Tracks with "rainy" tag: ${tracksWithRainyTag.length}`);

const tracksWithChillTag = TracksManager.getTracksByTags(["chill"]);
console.log(`Tracks with "chill" tag: ${tracksWithChillTag.length}`);

// Test 6: Check for edge cases
console.log("\n6. Testing edge cases:");
const unknownWeatherQueue = QueueManager.generateWeatherQueue(
  "unknown_weather",
  5,
);
console.log("Unknown weather queue:", unknownWeatherQueue);

const emptyTagsQueue = QueueManager.generateMoodQueue([], 5);
console.log("Empty tags queue:", emptyTagsQueue);

const nonExistentTagsQueue = QueueManager.generateMoodQueue(
  ["nonexistent", "fake"],
  5,
);
console.log("Non-existent tags queue:", nonExistentTagsQueue);
