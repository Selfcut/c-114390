
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Welcome page
    navigate('/', { replace: true });
  }, [navigate]);

  // Render a simple loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
};

export default Index;
