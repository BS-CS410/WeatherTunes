import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/auth-utils";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    // Debug information
    setDebugInfo(
      `URL: ${window.location.href}\nCode: ${code}\nError: ${error}`,
    );

    if (error) {
      console.error("OAuth error from Spotify:", error);
      setDebugInfo((prev) => prev + `\nOAuth error: ${error}`);
      navigate("/login?error=oauth_error");
      return;
    }

    if (!code) {
      console.error("No authorization code found");
      setDebugInfo((prev) => prev + "\nNo authorization code found");
      navigate("/login?error=missing_code");
      return;
    }

    console.log("Exchanging code for token:", code);
    setDebugInfo((prev) => prev + "\nExchanging code for token...");

    authService
      .exchangeCodeForToken(code)
      .then(() => {
        console.log("Authentication successful");
        setDebugInfo((prev) => prev + "\nAuthentication successful");
        // Redirect to the main page after successful authentication
        navigate("/");
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
        setDebugInfo(
          (prev) => prev + `\nAuthentication failed: ${error.message}`,
        );
        // Handle authentication error, e.g., redirect to an error page
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 text-lg">Loading...</div>
        <div className="text-sm whitespace-pre-line text-gray-500">
          {debugInfo}
        </div>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
