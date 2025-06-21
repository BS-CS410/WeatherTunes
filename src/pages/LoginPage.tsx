import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SimpleLogin } from "@/components/auth/SimpleLogin";

function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page if already authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show login component if not authenticated
  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  // Return null while redirecting
  return null;
}

export default Login;
