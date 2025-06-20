/**
 * Simple authentication status component for debugging auth issues
 */

import React from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { authService } from "@/lib/auth-utils";

export const AuthStatus: React.FC = () => {
  const { user, isLoading } = useAuthContext();

  const handleLogin = () => {
    authService.login();
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (isLoading) {
    return <div>Loading auth status...</div>;
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4 text-sm text-black">
      <h3 className="mb-2 font-semibold">Auth Status</h3>
      <div className="space-y-1">
        <div>
          Status: {user ? `✅ ${user.username}` : "❌ Not authenticated"}
        </div>
      </div>
      <div className="mt-3 space-x-2">
        {!user ? (
          <button
            onClick={handleLogin}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Login with Spotify
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
