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
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <img
        src={albumArtUrl}
        alt={`${songTitle} album art`}
        className="mb-4 h-32 w-32 rounded-md object-cover shadow-lg md:h-40 md:w-40"
      />
      <div className="text-center">
        <h2 className="w-full truncate text-lg font-semibold text-gray-800 md:text-xl dark:text-slate-200">
          {songTitle}
        </h2>
        <p className="w-full truncate text-sm text-gray-600 md:text-base dark:text-slate-400">
          {artistName}
        </p>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
