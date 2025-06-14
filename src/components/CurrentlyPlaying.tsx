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
      <div className="group">
        <img
          src={albumArtUrl}
          alt={`${songTitle} album art`}
          className="animate-pulse-updown mb-4 h-36 w-36 rounded-md object-cover shadow-lg transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:scale-110 hover:shadow-2xl hover:drop-shadow-md md:h-48 md:w-48"
        />
      </div>
      <div className="animate-float group/text text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <h2 className="truncate text-lg font-semibold text-gray-800 md:text-xl dark:text-slate-200">
            {songTitle}
          </h2>
          <div className="flex h-4 w-4 items-end space-x-0.5">
            {[1, 0.6, 0.8].map((_h, i) => (
              <span
                key={i}
                className={`animate-pulse-eq block h-full w-1 bg-gray-800 dark:bg-slate-200`}
              />
            ))}
          </div>
        </div>
        <p className="w-full truncate text-sm text-gray-600 md:text-base dark:text-slate-400">
          {artistName}
        </p>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
