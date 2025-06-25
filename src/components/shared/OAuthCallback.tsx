import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const OAuthCallback: React.FC = () => {
  console.log("OAuthCallback: Component rendered.");
  const { handleCallback } = useAuth();

  useEffect(() => {
    console.log("OAuthCallback: useEffect triggered. Calling handleCallback.");
    handleCallback();
    // eslint-disable-next-line
  }, [handleCallback]); // Added handleCallback to dependency array for clarity, though it's stable

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Authenticating...</h1>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};

export { OAuthCallback };
