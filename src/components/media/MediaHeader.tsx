
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload, Plus } from "lucide-react";
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
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Image size={28} className="text-primary" />
          Media Feed
        </h1>
        <p className="text-muted-foreground">Share and discover videos, images, and more</p>
      </div>
      <Button 
        onClick={handleCreatePost}
        className="flex items-center gap-2 hover-lift"
      >
        <Plus size={16} />
        <span>Create Post</span>
      </Button>
    </div>
  );
};
