import React from "react";
import { LiquidGlassContainer } from "./LiquidGlassContainer";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";
import { createLiquidGlassCard } from "../../lib/unifiedStyles";

/**
 * Example showing how to integrate liquid glass effects into your weather app
 */
export const WeatherLiquidGlassExample: React.FC = () => {
  const weatherCardGlass = useLiquidGlass({
    mouseResponsive: true,
    enableElastic: true,
    elasticity: 0.1,
  });

  const musicPlayerGlass = useLiquidGlass({
    mouseResponsive: true,
    enableChromatic: true,
    chromaticIntensity: 1.5,
  });

  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-8 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          WeatherTunes with Liquid Glass Effects
        </h1>

        {/* Weather Display with Liquid Glass */}
        <div
          ref={weatherCardGlass.ref as React.RefObject<HTMLDivElement>}
          className={weatherCardGlass.getClasses(
            createLiquidGlassCard("enhanced", {
              mouseResponsive: true,
              elastic: true,
            }) + " mb-8 p-8",
          )}
          style={weatherCardGlass.styles}
        >
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Current Weather
              </h2>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  72°F
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  Partly Cloudy
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  San Francisco, CA
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">
                    Humidity
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    65%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">Wind</div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    8 mph
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">
                    UV Index
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    5
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 dark:text-gray-400">
                    Pressure
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    30.12"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Music Player with Chromatic Glass */}
        <div
          ref={musicPlayerGlass.ref as React.RefObject<HTMLDivElement>}
          className={musicPlayerGlass.getClasses(
            createLiquidGlassCard("chromatic", {
              mouseResponsive: true,
              chromatic: true,
            }) + " mb-8 p-6",
          )}
          style={musicPlayerGlass.styles}
        >
          <div className="flex items-center space-x-6">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-purple-400 to-pink-500">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
              <div className="absolute inset-2 rounded bg-white/10"></div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                Sunny Day Vibes
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Perfect for 72°F and Partly Cloudy
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Weather-matched playlist • 12 songs
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Control Panel with Interactive Glass */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <LiquidGlassContainer
            variant="floating"
            mouseResponsive={true}
            className="p-6 text-center"
          >
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Weather
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Real-time conditions
              </p>
            </div>
          </LiquidGlassContainer>

          <LiquidGlassContainer
            variant="elastic"
            mouseResponsive={true}
            elasticity={0.2}
            className="p-6 text-center"
          >
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 backdrop-blur-sm">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Music
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Mood-based playlists
              </p>
            </div>
          </LiquidGlassContainer>

          <LiquidGlassContainer
            variant="interactive"
            mouseResponsive={true}
            className="p-6 text-center"
          >
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-sm">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Customize experience
              </p>
            </div>
          </LiquidGlassContainer>
        </div>

        {/* Implementation Notes */}
        <LiquidGlassContainer variant="enhanced" className="mt-8 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Implementation Notes
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              • Weather card uses elastic deformation that responds to mouse
              movement
            </p>
            <p>
              • Music player features chromatic aberration effects for visual
              depth
            </p>
            <p>
              • Control panels showcase different liquid glass variants with
              mouse responsiveness
            </p>
            <p>
              • All effects are CSS-based with JavaScript mouse tracking for
              performance
            </p>
            <p>• Fully compatible with your existing dark/light theme system</p>
          </div>
        </LiquidGlassContainer>
      </div>
    </div>
  );
};

export default WeatherLiquidGlassExample;
