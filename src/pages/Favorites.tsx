"use client"

import { useState } from "react"
import { Cloud, Play, Pause, SkipBack, SkipForward, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

function Favorites() {
  // Placeholder data - to be replaced with API call
  const weatherData = {
    location: "Seattle", // Will come from API
    temperature: "75", // Will come from API
    condition: "Sunny", // Will come from API
    unit: "°F",
  }
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)

  // Placeholder song data - to be replaced with Spotify API data
  const favoriteSongs = Array(8)
    .fill(null)
    .map((_, index) => ({
      id: index,
      name: "Song name",
      artist: "Artist name",
    }))

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#b2cdff] to-[#b2cdff] relative overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 md:p-6 relative z-10">
        <Cloud className="w-12 h-12 text-[#ffffff]" />

        {/* Weather Info - Top Right */}
        <div className="text-[#2e2e2e] text-lg md:text-xl font-medium">
          {weatherData.location} {weatherData.temperature}
          {weatherData.unit} {weatherData.condition}
        </div>
      </nav>

      {/* Search Bar */}
      <div className="flex justify-center px-4 md:px-8 mb-8">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Find in Favorites"
            className="w-full px-4 py-3 bg-[#ffffff]/70 backdrop-blur-sm rounded-full text-[#2e2e2e] placeholder-[#494a4b] border-none outline-none focus:bg-[#ffffff]/90 transition-all duration-200"
          />
        </div>
      </div>

      {/* Your Favorites Section */}
      <div className="flex flex-col items-center px-4 md:px-8 relative z-0">
        <h1 className="text-[#2e2e2e] text-4xl md:text-5xl font-bold mb-8">Your Favorites</h1>

        {/* Add to Favorites Button */}
        <div className="w-full max-w-2xl mb-6">
          <button className="flex items-center gap-3 text-[#2e2e2e] text-lg font-medium hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#ffffff]/70 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            Add songs to your Favorites
          </button>
        </div>

        {/* Favorites List */}
        <div className="w-full max-w-2xl">
          <div className="max-h-[40vh] overflow-y-auto scrollbar-invisible hover:scrollbar-visible pb-32">
            {favoriteSongs.map((song, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 mb-3 bg-[#ffffff]/50 backdrop-blur-sm rounded-2xl hover:bg-[#ffffff]/70 transition-all duration-200 cursor-pointer"
              >
                {/* Album Cover Placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#d9d9d9] to-[#494a4b]/30 rounded-lg flex items-center justify-center relative flex-shrink-0 shadow-sm hover:from-[#494a4b]/20 hover:to-[#494a4b]/40 transition-all duration-200">
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
                      className="w-6 h-6"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                </div>

                {/* Song Info */}
                <div className="flex flex-col flex-grow">
                  <span className="text-[#2e2e2e] font-medium text-lg">{song.name}</span>
                  <span className="text-[#494a4b] text-sm">{song.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sun Illustration */}
      <div className="absolute right-0 top-1/3 sm:top-1/2 transform -translate-y-1/2 translate-x-1/4 sm:translate-x-1/3">
        <div
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, #f8e36f 0%, #fa9e42 70%)`,
          }}
        />
      </div>

      {/* Music Player */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 md:px-6 z-20">
        <div className="bg-[#ffffff]/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4">
            {/* Album Cover and Track Info */}
            <div className="hidden sm:flex items-center space-x-4">
              {/* Album Cover Placeholder */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#d9d9d9] to-[#494a4b]/30 rounded-md flex items-center justify-center shadow-sm">
                <div className="text-[#494a4b] opacity-60">
                  
                </div>
              </div>

              {/* Track Info Placeholder */}
              <div className="flex flex-col">
                <span className="text-[#2e2e2e] font-medium text-sm">Song Name</span>
                <span className="text-[#494a4b] text-xs">Artist Name</span>
              </div>
            </div>

            {/* Time Placeholder */}
            <div className="text-[#494a4b] text-xs md:text-sm font-mono">2:34 / 3:42</div>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 md:w-12 md:h-12 text-[#2e2e2e] hover:bg-[#d9d9d9]/50"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 md:w-16 md:h-16 text-[#2e2e2e] hover:bg-[#d9d9d9]/50"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 md:w-12 md:h-12 text-[#2e2e2e] hover:bg-[#d9d9d9]/50"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="w-full bg-[#d9d9d9] rounded-full h-2">
              <div
                className="bg-[#2e2e2e] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
  )
}


export default Favorites;
