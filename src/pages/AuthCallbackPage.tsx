import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/auth-utils";

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      authService
        .exchangeCodeForToken(code)
        .then(() => {
          // Redirect to the main page after successful authentication
          navigate("/");
        })
        .catch((error) => {
          console.error("Authentication failed:", error);
          // Handle authentication error, e.g., redirect to an error page
          navigate("/login");
        });
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default AuthCallbackPage;
