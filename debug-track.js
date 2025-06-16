// Quick debug script to test track metadata fetching
import { getSpotifyTrackMetadata } from "./src/lib/spotifyWeather.js";

const testTrackId = "2TpxZ7JUBn3uw46aR7qd6V"; // Shape of You by Ed Sheeran

console.log("Testing track metadata fetch for:", testTrackId);

getSpotifyTrackMetadata(testTrackId)
  .then((result) => {
    console.log("Result:", result);
    console.log("Title:", result?.title);
    console.log("Artist:", result?.artist);
    console.log("Album Art:", result?.albumArt);
    console.log("Has artist?", !!result?.artist);
    console.log("Artist type:", typeof result?.artist);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
