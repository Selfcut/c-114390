
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon } from "lucide-react";

interface MediaEmptyStateProps {
  onCreatePost: () => void;
}

export const MediaEmptyState = ({ onCreatePost }: MediaEmptyStateProps) => {
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
        <ImageIcon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No media posts yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        Be the first to share content with the community
      </p>
      <Button onClick={onCreatePost}>
        <Plus className="mr-2 h-4 w-4" />
        Create Post
      </Button>
    </div>
  );
};
