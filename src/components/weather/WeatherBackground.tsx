import { useRef, useEffect, useState } from 'react';
import type { TimePeriod } from '@/lib';

// Use Vite's import.meta.glob for dynamic asset imports
const videoModules = import.meta.glob('/src/assets/videos/*.mp4');

const videoMap = {
  clear: { morning: 'clear_morning.mp4', day: 'clear_day.mp4', evening: 'clear_evening.mp4', night: 'clear_night.mp4' },
  clouds: { morning: 'clouds_morning.mp4', day: 'clouds_day.mp4', evening: 'clouds_evening.mp4', night: 'clouds_night.mp4' },
  rain: { morning: 'rain_morning.mp4', day: 'rain_day.mp4', evening: 'rain_evening.mp4', night: 'rain_night.mp4' },
  snow: { morning: 'snow_morning.mp4', day: 'snow_day.mp4', evening: 'snow_evening.mp4', night: 'snow_night.mp4' },
  fog: { morning: 'fog_morning.mp4', day: 'fog_day.mp4', evening: 'fog_evening.mp4', night: 'fog_night.mp4' },
  thunderstorm: { morning: 'rain_morning.mp4', day: 'rain_day.mp4', evening: 'rain_evening.mp4', night: 'rain_night.mp4' },
  drizzle: { morning: 'rain_morning.mp4', day: 'rain_day.mp4', evening: 'rain_evening.mp4', night: 'rain_night.mp4' },
} as const;

type WeatherConditionKey = keyof typeof videoMap;

function getWeatherType(condition = ''): WeatherConditionKey {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('clear')) return 'clear';
  if (lowerCondition.includes('cloud')) return 'clouds';
  if (lowerCondition.includes('rain')) return 'rain';
  if (lowerCondition.includes('snow')) return 'snow';
  if (lowerCondition.includes('fog')) return 'fog';
  if (lowerCondition.includes('thunderstorm')) return 'thunderstorm';
  if (lowerCondition.includes('drizzle')) return 'drizzle';
  return 'clear';
}

function getTimePeriod(hours: number): TimePeriod {
  if (hours >= 5 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 17) return 'day';
  if (hours >= 17 && hours < 21) return 'evening';
  return 'night';
}

interface VideoBackgroundProps {
  condition?: string;
  timePeriod?: TimePeriod | null;
}

export function WeatherBackground({ condition, timePeriod }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async () => {
      setIsVideoReady(false);
      const weatherType = getWeatherType(condition);
      const period = timePeriod || getTimePeriod(new Date().getHours());
      const videoFileName = videoMap[weatherType]?.[period] || videoMap.clear.day;
      const videoPath = `/src/assets/videos/${videoFileName}`;

      try {
        const moduleLoader = videoModules[videoPath];
        if (moduleLoader) {
          const videoModule = await moduleLoader();
          const newSrc = (videoModule as { default: string }).default;

          if (isMounted && newSrc !== currentSrc) {
            if (currentSrc) {
              setIsTransitioning(true);
              setTimeout(() => {
                if (isMounted) {
                  setCurrentSrc(newSrc);
                  setIsTransitioning(false);
                }
              }, 500);
            } else {
              setCurrentSrc(newSrc);
            }
          }
        } else {
          console.error(`Video module not found for path: ${videoPath}`);
        }
      } catch (error) {
        console.error('Failed to load video:', error);
      }
    };

    loadVideo();

    return () => {
      isMounted = false;
    };
  }, [condition, timePeriod, currentSrc]);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {currentSrc && (
        <video
          ref={videoRef}
          key={currentSrc}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            isVideoReady && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          src={currentSrc}
          onCanPlayThrough={() => setIsVideoReady(true)}
          aria-hidden="true"
        />
      )}
      {(!isVideoReady || isTransitioning) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
        </div>
      )}
    </div>
  );
}
