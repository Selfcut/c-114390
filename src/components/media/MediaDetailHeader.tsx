
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { MediaPost } from "@/utils/mediaUtils";

interface MediaDetailHeaderProps {
  post: MediaPost;
  handleBack: () => void;
}

export const MediaDetailHeader: React.FC<MediaDetailHeaderProps> = ({ post, handleBack }) => {
  // Format date
  const formatDate = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "some time ago";
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back to Media
      </Button>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author?.avatar_url} />
            <AvatarFallback>
              {post.author?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Posted by {post.author?.name || "Unknown"} • {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
