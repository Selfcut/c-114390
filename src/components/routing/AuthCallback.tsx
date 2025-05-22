
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AuthCallback = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Process auth callback
    const handleCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log("Auth callback successful");
          toast({
            title: "Authentication Successful",
            description: "You have been successfully authenticated."
          });
        }
      } catch (err: any) {
        console.error("Exception in auth callback:", err);
        setError(err.message || "Authentication error");
      } finally {
        setIsLoading(false);
      }
    };
    
    handleCallback();
  }, [toast]);

  // First wait for our callback to process, then check auth state
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="mb-6 animate-pulse">
            <div className="h-12 w-12 bg-primary/20 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing authentication...</h2>
            <p className="text-muted-foreground">Please wait while we log you in.</p>
          </div>
          
          {error && (
            <div className="text-destructive text-sm mt-4 p-2 bg-destructive/10 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } else if (error) {
    return <Navigate to="/auth?error=callback_error" replace />;
  } else {
    return <Navigate to="/auth" replace />;
  }
};
