import React from "react";
import { Button } from "@/components/ui/button";
import { Film, Upload, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface MediaHeaderProps {
  onCreatePost: () => void;
}

export const MediaHeader = ({ onCreatePost }: MediaHeaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to share media content",
        variant: "destructive"
      });
      return;
    }
    onCreatePost();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Film size={28} className="text-primary" />
        Media Hub
      </h1>
      <Button 
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto"
        onClick={handleCreatePost}
      >
        <Upload size={18} />
        <span>Share Media</span>
      </Button>
    </div>
  );
};
