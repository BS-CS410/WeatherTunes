import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks";
import { authService } from "@/lib/spotify-client";

function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page if already authenticated
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    authService.login();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login with Spotify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            className="w-full bg-[#1DB954] hover:bg-[#1ED760]"
          >
            Login via Spotify
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
