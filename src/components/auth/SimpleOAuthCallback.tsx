/**
 * Simple OAuth Callback Handler
 * Uses new auth system with proper error boundaries
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function SimpleOAuthCallback() {
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { handleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const success = await handleCallback();
        if (success) {
          setStatus("success");
          // Redirect after success
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          setStatus("error");
          setErrorMsg("Authentication failed. Please try again.");
        }
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("error");
        setErrorMsg(
          error instanceof Error ? error.message : "Authentication failed",
        );
      }
    };

    processCallback();
  }, [handleCallback]);

  const handleRetry = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        {status === "processing" && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div>
            <h2 className="mb-2 text-xl font-semibold">Authenticating...</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mb-4 text-green-500">
              <svg
                className="mx-auto h-12 w-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold">Success!</h2>
            <p className="text-gray-600">Redirecting to WeatherTunes...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <svg
                className="mx-auto h-12 w-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold">Authentication Error</h2>
            <p className="mb-4 text-gray-600">{errorMsg}</p>
            <button
              onClick={handleRetry}
              className="rounded bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
