import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const OAuthCallback: React.FC = () => {
  const { handleCallback } = useAuth();

  useEffect(() => {
    handleCallback();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Authenticating...</h1>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};

export { OAuthCallback };
