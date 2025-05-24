
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingScreen } from '@/components/LoadingScreen';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth?error=callback_failed');
          return;
        }

        if (data.session) {
          // Successful authentication
          navigate('/dashboard');
        } else {
          // No session found
          navigate('/auth');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/auth?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingScreen message="Completing authentication..." />;
};
