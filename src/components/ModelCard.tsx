
import React from 'react';
import { cn } from "@/lib/utils";
import { Play, Heart } from "lucide-react";
import { polymathToast } from "@/components/ui/use-toast";

interface ModelCardProps {
  title: string;
  subtitle: string;
  image: string;
  isNew?: boolean;
  likes?: number;
  className?: string;
  animationDelay?: string;
}

export const ModelCard = ({ 
  title, 
  subtitle, 
  image, 
  isNew = false,
  likes = 0,
  className,
  animationDelay
}: ModelCardProps) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(likes);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    
    if (!liked) {
      polymathToast({
        title: "Content Liked",
        description: `You liked "${title}"`,
      });
    }
  };
  
  const handlePlay = () => {
    polymathToast({
      title: "Starting Content",
      description: `Now playing "${title}"`,
    });
  };
  
  return (
    <div 
      className={cn(
        "bg-muted rounded-lg overflow-hidden flex flex-col feature-card",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-40 object-cover" />
        {isNew && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            New
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <button 
            className={cn(
              "flex items-center gap-1 text-sm",
              liked ? "text-red-400" : "text-gray-400 hover:text-red-400"
            )}
            onClick={handleLike}
          >
            <Heart size={14} className={liked ? "fill-red-400" : ""} />
            <span>{likeCount}</span>
          </button>
          
          <button 
            className="run-button bg-[#6E59A5] hover:bg-[#7E69AB] text-white px-4 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium"
            onClick={handlePlay}
          >
            <Play size={14} className="fill-white" />
            <span>Explore</span>
          </button>
        </div>
      </div>
    </div>
  );
};
