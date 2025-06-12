import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicData {
  songName: string;
  artistName: string;
  duration: string;
  currentTime: string;
  albumCover: string;
}

interface MusicPlayerProps {
  musicData: MusicData;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  progress: number;
}

export function MusicPlayer({
  musicData,
  isPlaying,
  setIsPlaying,
  progress,
}: MusicPlayerProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 mx-auto w-full max-w-2xl">
      <div className="rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          {/* Album Cover and Track Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Album Cover */}
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md sm:h-12 sm:w-12">
              {musicData.albumCover ? (
                <img
                  src={musicData.albumCover}
                  alt="Album cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-[#494a4b]">Cover</span>
              )}
            </div>

            {/* Track Info */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 sm:text-base">
                {musicData.songName}
              </span>
              <span className="text-xs text-gray-600 sm:text-sm">
                {musicData.artistName}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="font-mono text-sm text-gray-600 sm:text-base">
            {musicData.currentTime} / {musicData.duration}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center space-x-4 sm:space-x-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-800 transition hover:bg-gray-300/50 sm:h-12 sm:w-12"
          >
            <SkipBack className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 text-gray-800 transition hover:bg-gray-300/50 sm:h-16 sm:w-16"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
            ) : (
              <Play className="ml-0.5 h-6 w-6 sm:ml-1 sm:h-8 sm:w-8" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-800 transition hover:bg-gray-300/50 sm:h-12 sm:w-12"
          >
            <SkipForward className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="h-2 w-full rounded-full bg-gray-300">
            <div
              className="h-2 rounded-full bg-gray-800 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
