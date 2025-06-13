"use client";

import { useState } from "react";
import { Cloud, Play, Pause, SkipBack, SkipForward, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function Favorites() {
  // Placeholder data - to be replaced with API call
  const weatherData = {
    location: "Seattle", // Will come from API
    temperature: "75", // Will come from API
    condition: "Sunny", // Will come from API
    unit: "°F",
  };
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  // Placeholder song data - to be replaced with Spotify API data
  const favoriteSongs = Array(8)
    .fill(null)
    .map((_, index) => ({
      id: index,
      name: "Song name",
      artist: "Artist name",
    }));

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-[#b2cdff] to-[#b2cdff]">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <Cloud className="h-12 w-12 text-[#ffffff]" />

        {/* Weather Info - Top Right */}
        <div className="text-lg font-medium text-[#2e2e2e] md:text-xl">
          {weatherData.location} {weatherData.temperature}
          {weatherData.unit} {weatherData.condition}
        </div>
      </nav>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center px-4 md:px-8">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Find in Favorites"
            className="w-full rounded-full border-none bg-[#ffffff]/70 px-4 py-3 text-[#2e2e2e] placeholder-[#494a4b] backdrop-blur-sm transition-all duration-200 outline-none focus:bg-[#ffffff]/90"
          />
        </div>
      </div>

      {/* Your Favorites Section */}
      <div className="relative z-0 flex flex-col items-center px-4 md:px-8">
        <h1 className="mb-8 text-4xl font-bold text-[#2e2e2e] md:text-5xl">
          Your Favorites
        </h1>

        {/* Add to Favorites Button */}
        <div className="mb-6 w-full max-w-2xl">
          <button className="flex items-center gap-3 text-lg font-medium text-[#2e2e2e] transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffffff]/70">
              <Plus className="h-5 w-5" />
            </div>
            Add songs to your Favorites
          </button>
        </div>

        {/* Favorites List */}
        <div className="w-full max-w-2xl">
          <div className="scrollbar-invisible hover:scrollbar-visible max-h-[40vh] overflow-y-auto pb-32">
            {favoriteSongs.map((song, index) => (
              <div
                key={index}
                className="mb-3 flex cursor-pointer items-center gap-4 rounded-2xl bg-[#ffffff]/50 p-4 backdrop-blur-sm transition-all duration-200 hover:bg-[#ffffff]/70"
              >
                {/* Album Cover Placeholder */}
                <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#d9d9d9] to-[#494a4b]/30 shadow-sm transition-all duration-200 hover:from-[#494a4b]/20 hover:to-[#494a4b]/40">
                  {/* Music note icon placeholder */}
                  <div className="text-[#494a4b] opacity-60">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                </div>

                {/* Song Info */}
                <div className="flex flex-grow flex-col">
                  <span className="text-lg font-medium text-[#2e2e2e]">
                    {song.name}
                  </span>
                  <span className="text-sm text-[#494a4b]">{song.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sun Illustration */}
      <div className="absolute top-1/3 right-0 translate-x-1/4 -translate-y-1/2 transform sm:top-1/2 sm:translate-x-1/3">
        <div
          className="h-64 w-64 rounded-full sm:h-80 sm:w-80 md:h-96 md:w-96"
          style={{
            background: `radial-gradient(circle at 30% 30%, #f8e36f 0%, #fa9e42 70%)`,
          }}
        />
      </div>

      {/* Music Player */}
      <div className="absolute bottom-4 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 transform px-4 md:bottom-8 md:px-6">
        <div className="rounded-2xl bg-[#ffffff]/50 p-4 shadow-lg backdrop-blur-sm md:p-6">
          <div className="mb-4 flex flex-col items-center sm:flex-row sm:justify-between">
            {/* Album Cover and Track Info */}
            <div className="hidden items-center space-x-4 sm:flex">
              {/* Album Cover Placeholder */}
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-[#d9d9d9] to-[#494a4b]/30 shadow-sm">
                <div className="text-[#494a4b] opacity-60"></div>
              </div>

              {/* Track Info Placeholder */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#2e2e2e]">
                  Song Name
                </span>
                <span className="text-xs text-[#494a4b]">Artist Name</span>
              </div>
            </div>

            {/* Time Placeholder */}
            <div className="font-mono text-xs text-[#494a4b] md:text-sm">
              2:34 / 3:42
            </div>
          </div>

          <div className="mb-4 flex items-center justify-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-[#2e2e2e] hover:bg-[#d9d9d9]/50 md:h-12 md:w-12"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-[#2e2e2e] hover:bg-[#d9d9d9]/50 md:h-16 md:w-16"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="ml-1 h-8 w-8" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-[#2e2e2e] hover:bg-[#d9d9d9]/50 md:h-12 md:w-12"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="h-2 w-full rounded-full bg-[#d9d9d9]">
              <div
                className="h-2 rounded-full bg-[#2e2e2e] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-invisible::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-invisible::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-invisible::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 9999px;
        }
        .hover\\:scrollbar-visible:hover::-webkit-scrollbar-thumb {
          background-color: rgba(73, 74, 75, 0.6);
        }
        .hover\\:scrollbar-visible:hover::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default Favorites;
