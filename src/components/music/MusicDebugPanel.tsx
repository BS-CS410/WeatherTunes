import React, { useEffect, useState } from "react";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";
import { getSpotifyTrackMetadata } from "@/lib/spotifyWeather";

interface TrackData {
  title: string;
  artist: string;
  albumArt: string;
}

interface MusicDebugPanelProps {
  currentTrackId?: string;
  queueIndex?: number;
  showTrackSync?: boolean;
  showDirectFetch?: boolean;
}

/**
 * Unified debug component for music-related development and debugging
 * Combines track sync debugging and direct API fetch testing
 * Only displays in development mode
 */
export const MusicDebugPanel: React.FC<MusicDebugPanelProps> = ({
  currentTrackId,
  queueIndex = 0,
  showTrackSync = true,
  showDirectFetch = false,
}) => {
  const {
    trackMetadata,
    currentTrackId: contextTrackId,
    isLoading,
  } = useCurrentTrackContext();

  const [directFetchData, setDirectFetchData] = useState<TrackData | null>(
    null,
  );

  useEffect(() => {
    if (!showDirectFetch) return;

    // Test with the first track from sampleQueue
    const testTrackId = "2TpxZ7JUBn3uw46aR7qd6V"; // Shape of You

    getSpotifyTrackMetadata(testTrackId)
      .then((data) => {
        console.log("🔍 Direct fetch result:", data);
        setDirectFetchData(data);
      })
      .catch((error) => {
        console.error("🔍 Fetch error:", error);
      });
  }, [showDirectFetch]);

  // Only show in development
  if (import.meta.env.PROD) return null;

  const isSync = currentTrackId === contextTrackId;

  return (
    <div className="fixed top-4 right-4 max-w-md rounded-lg border-2 border-yellow-400 bg-black/90 p-4 font-mono text-xs text-white">
      <h3 className="mb-3 font-bold text-yellow-400">🔍 Music Debug Panel</h3>

      {showTrackSync && (
        <div className="mb-4 space-y-3 border-b border-yellow-400/50 pb-4">
          <div className="font-bold text-blue-400">TRACK SYNC:</div>
          <div>
            Queue Index: <span className="text-yellow-400">{queueIndex}</span>
          </div>
          <div>
            Queue Track:{" "}
            <span
              className={currentTrackId ? "text-green-400" : "text-red-400"}
            >
              {currentTrackId ? `${currentTrackId.substring(0, 8)}...` : "null"}
            </span>
          </div>
          <div>
            Context Track:{" "}
            <span
              className={contextTrackId ? "text-green-400" : "text-red-400"}
            >
              {contextTrackId ? `${contextTrackId.substring(0, 8)}...` : "null"}
            </span>
          </div>
          <div>
            Sync Status:{" "}
            <span className={isSync ? "text-green-400" : "text-red-400"}>
              {isSync ? "✅ SYNCED" : "❌ OUT OF SYNC"}
            </span>
          </div>
          <div>
            Loading:{" "}
            <span className="text-yellow-400">{isLoading ? "YES" : "NO"}</span>
          </div>
          {trackMetadata && (
            <div className="mt-2 rounded bg-gray-800 p-2">
              <div className="text-green-400">Metadata:</div>
              <div>Title: {trackMetadata.title}</div>
              <div>Artist: {trackMetadata.artist}</div>
            </div>
          )}
        </div>
      )}

      {showDirectFetch && (
        <div className="space-y-3">
          <div className="font-bold text-purple-400">DIRECT FETCH TEST:</div>
          {directFetchData ? (
            <div className="rounded bg-gray-800 p-2">
              <div>Title: "{directFetchData.title}"</div>
              <div>Artist: "{directFetchData.artist}"</div>
              <div>Has Artist: {directFetchData.artist ? "YES" : "NO"}</div>
              <div>Album Art: {directFetchData.albumArt ? "✅" : "❌"}</div>
            </div>
          ) : (
            <div className="text-yellow-400">Loading direct fetch...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicDebugPanel;
