"use client"

import { useState, useEffect } from "react" //for API
import { Cloud, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"

function Home() {
  const [weatherData, setWeatherData] = useState({
    location: "",
    temperature: "",
    condition: "",
    unit: "°F",
  })
  const [musicData, setMusicData] = useState({
    songName: "Song Name",
    artistName: "Artist Name",
    duration: "3:42",
    currentTime: "2:34",
    albumCover: "",
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)

  // Weather API call
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Replace with OpenWeatherMap API key
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        const city = "Seattle" // You can make this dynamic
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
        )
        if (!response.ok) throw new Error("Weather API error")
        const data = await response.json()
        
        setWeatherData({
          location: data.name,
          temperature: Math.round(data.main.temp).toString(),
          condition: data.weather[0].main,
          unit: "°F",
        })
      } catch (error) {
        console.error("Error fetching weather:", error)
        setWeatherData({
          location: "Error",
          temperature: "--",
          condition: "Unable to load",
          unit: "°F",
        })
      }
    }

    fetchWeather()
  }, [])

  // Music API call (placeholder )
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        // Replace later
        const response = await fetch("https://api.example.com/current-track", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MUSIC_API_KEY}`,
          },
        })
        if (!response.ok) throw new Error("Music API error")
        const data = await response.json()

        setMusicData({
          songName: data.track?.name || "Unknown Song",
          artistName: data.track?.artist || "Unknown Artist",
          duration: data.track?.duration || "3:42",
          currentTime: data.track?.currentTime || "2:34",
          albumCover: data.track?.albumCover || "",
        })

        // Update progress based on currentTime and duration
        const [currentMins, currentSecs] = data.track?.currentTime.split(":").map(Number)
        const [totalMins, totalSecs] = data.track?.duration.split(":").map(Number)
        const current = currentMins * 60 + currentSecs
        const total = totalMins * 60 + totalSecs
        setProgress((current / total) * 100)
      } catch (error) {
        console.error("Error fetching music data:", error)
        setMusicData({
          songName: "Error",
          artistName: "Unable to load",
          duration: "0:00",
          currentTime: "0:00",
          albumCover: "",
        })
      }
    }

   
    // Optionally, poll for music updates
    fetchMusicData() // ensures the music player displays data immediately when the component loads.
    const interval = setInterval(fetchMusicData, 5000) // Update every 5 seconds; keeps the music data fresh by periodically checking for updates (e.g., if the user skips to a new song)
    return () => clearInterval(interval) //prevents the interval from running after the component is gone, which is critical for performance and avoiding errors
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b2cdff] to-[#b2cdff] relative overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center p-6 relative z-10">
        <Cloud className="w-12 h-12 text-[#ffffff]" />
      </nav>

      {/* Weather Content */}
      <div className="flex flex-col items-start px-38 mt-35 relative z-10">
        <h1 className="text-[#2e2e2e] text-5xl font-bold mb-4">{weatherData.location || "Loading..."}</h1>
        <div className="text-[#2e2e2e] text-8xl font-bold mb-2">
          {weatherData.temperature ? `${weatherData.temperature}${weatherData.unit}` : "--°"}
        </div>
        <p className="text-[#494a4b] text-2xl">{weatherData.condition || "Loading..."}</p>
      </div>

      {/* Sun Illustration */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/3">
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, #f8e36f 0%, #fa9e42 70%)`,
          }}
        />
      </div>

      {/* Music Player */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6">
        <div className="bg-[#ffffff]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            {/* Album Cover and Track Info */}
            <div className="flex items-center space-x-4">
              {/* Album Cover */}
              <div className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden">
                {musicData.albumCover ? (
                  <img src={musicData.albumCover} alt="Album cover" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#494a4b] text-xs">Cover</span>
                )}
              </div>

              {/* Track Info */}
              <div className="flex flex-col">
                <span className="text-[#2e2e2e] font-medium text-sm">{musicData.songName}</span>
                <span className="text-[#494a4b] text-xs">{musicData.artistName}</span>
              </div>
            </div>

            {/* Time */}
            <div className="text-[#494a4b] text-sm font-mono">{musicData.currentTime} / {musicData.duration}</div>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-4">
            <Button variant="ghost" size="icon" className="w-12 h-12 text-[#2e2e2e] hover:bg-[#d9d9d9]/50">
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-16 h-16 text-[#2e2e2e] hover:bg-[#d9d9d9]/50"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>

            <Button variant="ghost" size="icon" className="w-12 h-12 text-[#2e2e2e] hover:bg-[#d9d9d9]/50">
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
    </div>
  )
}

export default Home