import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/hooks-index";

function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page if already authenticated
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login with Spotify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-[#1DB954] hover:bg-[#1ED760]">
            <a
              href={
                import.meta.env.VITE_API_URL
                  ? `${import.meta.env.VITE_API_URL}/auth/login`
                  : "http://127.0.0.1:8000/auth/login"
              }
            >
              Login via Spotify
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
