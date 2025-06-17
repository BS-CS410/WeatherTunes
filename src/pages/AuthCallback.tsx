import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/auth";

function AuthCallback() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = await authService.handleCallback();
        if (success) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
      } finally {
        setIsChecking(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking login status...</p>
      </div>
    );
  }

  return null;
}

export default AuthCallback;
