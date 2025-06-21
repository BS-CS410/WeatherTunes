/**
 * Simple authentication status component for debugging auth issues
 */

import React from "react";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";

export const AuthStatus: React.FC = () => {
  const { user, isLoading, error, login, logout } = useSpotifyAuth();

  if (isLoading) {
    return <div>Loading auth status...</div>;
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4 text-sm text-black">
      <h3 className="mb-2 font-semibold">Auth Status</h3>
      <div className="space-y-1">
        <div>
          Status:{" "}
          {user ? `✅ ${user.display_name || user.id}` : "❌ Not authenticated"}
        </div>
        {error && <div className="text-red-600">Error: {error}</div>}
      </div>
      <div className="mt-3 space-x-2">
        {!user ? (
          <button
            onClick={login}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Login with Spotify
          </button>
        ) : (
          <button
            onClick={logout}
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
