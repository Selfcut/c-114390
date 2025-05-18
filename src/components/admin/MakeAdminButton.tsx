
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MakeAdminButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const makeUserAdmin = async () => {
    setIsLoading(true);
    try {
      // Call the assign-admin-role edge function
      const { data, error } = await supabase.functions.invoke('assign-admin-role', {
        method: 'POST'
      });

      if (error) {
        console.error('Error assigning admin role:', error);
        toast({
          title: "Error making user admin",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Admin role assigned successfully",
        });
      } else {
        toast({
          title: "Operation failed",
          description: data.message || "Failed to assign admin role",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Exception when making admin:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={makeUserAdmin}
      disabled={isLoading}
      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
      <span>Make "polymath" Admin</span>
    </Button>
  );
};
