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
    <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
      {/* Container for album art and its glow, handles sizing and margin */}
      <div className="group relative mb-4 h-36 w-36 md:h-48 md:w-48">
        {/* Pulsing glow effect - behind the image */}
        <div className="absolute inset-0 z-0 h-full w-full animate-pulse rounded-md bg-gray-100/70 blur-2xl dark:bg-white/30" />
        {/* Album art - on top */}
        <img
          src={albumArtUrl}
          alt={`${songTitle} album art`}
          className="relative z-10 h-full w-full rounded-md object-cover shadow-lg transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 hover:shadow-2xl hover:drop-shadow-md"
        />
      </div>
      <div className="animate-float group/text text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="truncate text-lg font-semibold text-gray-800 md:text-xl dark:text-slate-200">
            {songTitle}
          </h2>
        </div>
        <p className="w-full truncate text-sm text-gray-600 md:text-base dark:text-slate-400">
          {artistName}
        </p>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
