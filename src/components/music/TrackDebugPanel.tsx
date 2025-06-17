import { useEffect, useState } from "react";
import { getSpotifyTrackMetadata } from "@/lib/spotifyWeather";

interface TrackData {
  title: string;
  artist: string;
  albumArt: string;
}

const TrackDebugger = () => {
  const [trackData, setTrackData] = useState<TrackData | null>(null);

  useEffect(() => {
    // Test with the first track from sampleQueue
    const testTrackId = "2TpxZ7JUBn3uw46aR7qd6V"; // Shape of You

    getSpotifyTrackMetadata(testTrackId)
      .then((data) => {
        console.log("🔍 Direct fetch result:", data);
        console.log("🔍 Data keys:", data ? Object.keys(data) : "null");
        console.log("🔍 Artist value:", data?.artist);
        console.log("🔍 Artist exists:", "artist" in (data || {}));
        console.log("🔍 Full object:", JSON.stringify(data, null, 2));
        setTrackData(data);
      })
      .catch((error) => {
        console.error("🔍 Fetch error:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px" }}>
      <h3>Track Debugger</h3>
      <pre>{JSON.stringify(trackData, null, 2)}</pre>
      {trackData && (
        <div>
          <p>Title: "{trackData.title}"</p>
          <p>Artist: "{trackData.artist}"</p>
          <p>Has Artist: {!!trackData.artist ? "YES" : "NO"}</p>
          <p>Album Art: {trackData.albumArt}</p>
        </div>
      )}
    </div>
  );
};

export default TrackDebugger;
