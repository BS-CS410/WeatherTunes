import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Call backend session check
    fetch("http://127.0.0.1:8000/session", {
      credentials: "include", // important to send cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) {
          // Logged in, go to main page
          navigate("/");
        } else {
          // Not logged in, go to login page
          navigate("/login");
        }
      })
      .catch(() => {
        // On error, go to login page
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Checking login status...</p>
    </div>
  );
}

export default AuthCallback;
