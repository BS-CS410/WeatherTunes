/**
 * Simple Login Component
 * Uses new auth system
 */

import { useAuth } from "@/hooks/useAuth";

export function SimpleLogin() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = () => {
    login().catch((err) => {
      console.error("Login failed:", err);
      // Error state is handled by the auth context
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            WeatherTunes
          </h1>
          <p className="mb-8 text-gray-600">
            Discover music that matches your weather and mood.
          </p>

          {error && (
            <div className="mb-4 rounded bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading ? "Connecting..." : "Login with Spotify"}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            You'll be redirected to Spotify to authorize WeatherTunes.
          </p>
        </div>
      </div>
    </div>
  );
}
