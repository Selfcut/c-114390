
import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AuthCallback = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Process auth callback
    const handleCallback = async () => {
      try {
        // Check if there's an error in the URL
        const errorParam = searchParams.get('error');
        const errorDescriptionParam = searchParams.get('error_description');
        
        if (errorParam) {
          console.error("Auth error from URL params:", errorParam, errorDescriptionParam);
          setError(errorDescriptionParam || errorParam);
          toast({
            title: "Authentication Error",
            description: errorDescriptionParam || errorParam,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Process the callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive"
          });
        } else if (data.session) {
          console.log("Auth callback successful");
          toast({
            title: "Authentication Successful",
            description: "You have been successfully authenticated."
          });
        } else {
          console.warn("No error but no session either");
          // No explicit error but no session either
          setError("Authentication process completed but no session was created.");
        }
      } catch (err: any) {
        console.error("Exception in auth callback:", err);
        setError(err.message || "Authentication error");
        toast({
          title: "Authentication Error",
          description: err.message || "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    handleCallback();
  }, [toast, searchParams]);

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
