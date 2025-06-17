import React from "react";
import { useCurrentTrackContext } from "@/contexts/useCurrentTrackContext";

interface TrackSyncDebugProps {
  currentTrackId: string | undefined;
  queueIndex: number;
  queue: string[];
}

/**
 * Debug component to identify track sync issues
 * Shows iframe track vs metadata track side by side
 */
const TrackSyncDebug: React.FC<TrackSyncDebugProps> = ({
  currentTrackId,
  queueIndex,
  queue,
}) => {
  const {
    trackMetadata,
    currentTrackId: contextTrackId,
    isLoading,
  } = useCurrentTrackContext();

  if (import.meta.env.PROD) return null; // Only show in development

  const isSync = currentTrackId === contextTrackId;

  return (
    <div className="fixed top-4 right-4 max-w-md rounded-lg border-2 border-yellow-400 bg-black/90 p-4 font-mono text-xs text-white">
      <h3 className="mb-3 font-bold text-yellow-400">🔍 Track Sync Debug</h3>

      <div className="space-y-3">
        {/* Current State */}
        <div>
          <div className="font-bold text-blue-400">CURRENT STATE:</div>
          <div>
            Queue Index: <span className="text-yellow-400">{queueIndex}</span>
          </div>
          <div>
            Queue Length:{" "}
            <span className="text-yellow-400">{queue.length}</span>
          </div>
        </div>

        {/* Iframe Track */}
        <div>
          <div className="font-bold text-green-400">IFRAME TRACK:</div>
          <div className="break-all text-green-300">
            {currentTrackId || "None"}
          </div>
        </div>

        {/* Context Track */}
        <div>
          <div className="font-bold text-purple-400">METADATA TRACK:</div>
          <div className="break-all text-purple-300">
            {contextTrackId || "None"}
          </div>
          <div className="text-gray-400">
            {isLoading
              ? "Loading..."
              : trackMetadata
                ? `"${trackMetadata.title}" by ${trackMetadata.artist}`
                : "No metadata"}
          </div>
        </div>

        {/* Sync Status */}
        <div
          className={`rounded p-2 ${isSync ? "bg-green-800" : "bg-red-800"}`}
        >
          <div className="font-bold">
            {isSync ? "✅ IN SYNC" : "❌ OUT OF SYNC"}
          </div>
          {!isSync && (
            <div className="mt-1 text-xs">
              Iframe and metadata showing different tracks!
            </div>
          )}
        </div>

        {/* Queue Display */}
        <div>
          <div className="font-bold text-gray-400">QUEUE:</div>
          <div className="max-h-32 overflow-y-auto">
            {queue.map((id, idx) => (
              <div
                key={id}
                className={`text-xs ${idx === queueIndex ? "font-bold text-yellow-400" : "text-gray-500"}`}
              >
                {idx}: {id.substring(0, 12)}...
                {idx === queueIndex ? " ← CURRENT" : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackSyncDebug;
