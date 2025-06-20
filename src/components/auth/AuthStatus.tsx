/**
 * Simple authentication status component for debugging auth issues
 */

import React, { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { authService } from "@/lib/auth-utils";
import { apiClient } from "@/lib/api-client";

export const AuthStatus: React.FC = () => {
  const { user, isLoading } = useAuthContext();
  const [backendStatus, setBackendStatus] = useState<string>("checking...");

  const checkBackendAuth = async () => {
    try {
      const response = await apiClient.get("/auth/session");
      const data = response.data as {
        authenticated: boolean;
        username?: string;
      };
      setBackendStatus(
        data.authenticated
          ? `✅ Backend authenticated: ${data.username}`
          : "❌ Backend not authenticated",
      );
    } catch (error) {
      setBackendStatus(`❌ Backend error: ${error}`);
    }
  };

  const handleLogin = () => {
    authService.login();
  };

  const handleForceSync = async () => {
    setBackendStatus("syncing...");
    await authService.forceAuthSync();
    await checkBackendAuth();
  };

  React.useEffect(() => {
    checkBackendAuth();
  }, []);

  if (isLoading) {
    return <div>Loading auth status...</div>;
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4 text-sm text-black">
      <h3 className="mb-2 font-semibold">Auth Status Debug</h3>
      <div className="space-y-1">
        <div>
          Frontend: {user ? `✅ ${user.username}` : "❌ Not authenticated"}
        </div>
        <div>Backend: {backendStatus}</div>
      </div>
      <div className="mt-3 space-x-2">
        <button
          onClick={handleLogin}
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={handleForceSync}
          className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
        >
          Sync Auth
        </button>
        <button
          onClick={checkBackendAuth}
          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        >
          Check Backend
        </button>
      </div>
    </div>
  );
};
