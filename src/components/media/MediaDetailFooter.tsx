
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share } from "lucide-react";
import { MediaPost } from "@/utils/mediaUtils";

interface MediaDetailFooterProps {
  post: MediaPost;
}

export const MediaDetailFooter: React.FC<MediaDetailFooterProps> = ({ post }) => {
  const { toast } = useToast();
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
    });
  };

  return (
    <div className="flex justify-between border-t p-4">
      <div className="flex space-x-4">
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <ThumbsUp size={16} className="mr-1" />
          <span>{post.likes || 0}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <MessageSquare size={16} className="mr-1" />
          <span>{post.comments || 0}</span>
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center space-x-1"
      >
        <Share size={16} className="mr-1" />
        <span>Share</span>
      </Button>
    </div>
  );
};
