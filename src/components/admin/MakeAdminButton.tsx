
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export const MakeAdminButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const makeUserAdmin = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Call the assign-admin-role edge function
      const { data, error } = await supabase.functions.invoke('assign-admin-role', {
        method: 'POST',
        body: {
          userId: user.id, // Pass the current user's ID
          email: user.email // Also pass email for additional validation
        }
      });

      if (error) {
        console.error('Error assigning admin role:', error);
        toast({
          title: "Error making user admin",
          description: error.message || "Could not assign admin role",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: data.message || "Admin role assigned successfully",
        });
        
        // Reload the page to refresh the auth state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Operation failed",
          description: data?.message || "Failed to assign admin role",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error('Exception when making admin:', err);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if user is already admin or not logged in
  if (!user || user.isAdmin) {
    return null;
  }

  return (
    <Button 
      onClick={makeUserAdmin}
      disabled={isLoading}
      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600"
      size={window.innerWidth < 640 ? "sm" : "default"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
      <span>Make Admin</span>
    </Button>
  );
};
