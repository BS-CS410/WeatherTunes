import React from "react";

interface CurrentlyPlayingProps {
  songTitle?: string;
  artistName?: string;
  albumArtUrl?: string;
}

const CurrentlyPlaying: React.FC<CurrentlyPlayingProps> = ({
  songTitle = "Song Title",
  artistName = "Artist Name",
  albumArtUrl = "https://via.placeholder.com/150", // Placeholder image
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 transition-all duration-300 ease-in-out">
      {/* Container for album art and its glow, handles sizing and margin */}
      <div className="group relative mb-4 h-[clamp(6rem,24vw,12rem)] w-[clamp(6rem,24vw,12rem)]">
        {/* Pulsing glow effect - behind the image */}
        <style>
          {`
            @keyframes custom-pulse-brightness {
              0%, 100% { filter: brightness(1.1); }
              50% { filter: brightness(0.7); }
            }
          `}
        </style>
        <div
          className="absolute inset-0 z-0 h-full w-full rounded-md bg-gray-100/70 shadow-[0_0_32px_8px_rgba(0,0,0,0.25)] blur-2xl dark:bg-white/30 dark:shadow-[0_0_48px_12px_rgba(255,255,255,0.45)] dark:brightness-105"
          style={{
            animation: "custom-pulse-brightness 4s ease-in-out infinite",
          }}
        />
        {/* Album art - on top */}
        <img
          src={albumArtUrl}
          alt={`${songTitle} album art`}
          className="relative z-10 h-full w-full rounded-md object-cover shadow-lg transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 hover:shadow-2xl hover:drop-shadow-md"
        />
      </div>
      <div className="text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="truncate text-[clamp(1rem,4vw,2rem)] font-semibold text-gray-800 dark:text-slate-200">
            {songTitle}
          </h2>
        </div>
        <p className="truncate text-[clamp(0.8rem,2.5vw,1.2rem)] text-gray-600 dark:text-slate-400">
          {artistName}
        </p>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
