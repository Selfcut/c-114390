
import { MessageSquare, Quote, ThumbsUp, BookmarkPlus } from "lucide-react";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { polymathToast } from "@/components/ui/use-toast";

interface QuoteCardProps {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  likes: number;
  comments: number;
  imageUrl?: string;
  isBookmarked?: boolean;
}

export const QuoteCard = ({
  id,
  text,
  author,
  source,
  category,
  likes,
  comments,
  imageUrl,
  isBookmarked = false,
}: QuoteCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    polymathToast.resourceBookmarked();
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden flex flex-col">
      {imageUrl && (
        <div className="w-full h-40 relative">
          <AspectRatio ratio={16/9}>
            <img 
              src={imageUrl} 
              alt={`Visual for quote by ${author}`} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      )}

      <div className="p-5 flex-grow">
        <div className="flex items-start mb-4">
          <div className="p-2 rounded-full bg-[#360036] mr-3">
            <Quote size={18} className="text-[#FF3EA5]" />
          </div>
          <span className="text-xs text-[#FF3EA5] font-medium bg-[#360036]/30 px-2 py-0.5 rounded">
            {category}
          </span>
        </div>

        <blockquote className="text-white text-lg font-medium mb-4 italic">
          "{text}"
        </blockquote>
        
        <div className="text-gray-400 text-sm mb-6">
          <span className="font-medium text-white">{author}</span>
          {source && <span> • {source}</span>}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${liked ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <ThumbsUp size={16} className={liked ? "fill-blue-400" : ""} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-400">
              <MessageSquare size={16} />
              <span>{comments}</span>
            </button>
          </div>
          <button 
            onClick={handleBookmark}
            className={`p-1.5 rounded-full ${bookmarked ? 'bg-blue-900/30 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <BookmarkPlus size={18} className={bookmarked ? "fill-blue-400" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};
