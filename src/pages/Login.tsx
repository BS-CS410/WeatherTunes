import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Login() {
  const handleSpotifyLogin = () => {
    window.location.href = "http://127.0.0.1:8000/login";
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
            onClick={handleSpotifyLogin}
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
