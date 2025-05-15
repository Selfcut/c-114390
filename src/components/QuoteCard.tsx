
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
  comments?: number;
  imageUrl?: string;
  isBookmarked?: boolean;
  quote?: any; // For backward compatibility with the old API
  animationDelay?: string;
  onLike?: () => void;
}

export const QuoteCard = ({
  id,
  text,
  author,
  source,
  category,
  likes,
  comments = 0,
  imageUrl,
  isBookmarked = false,
  quote,
  animationDelay,
  onLike,
}: QuoteCardProps) => {
  // If the quote object is provided, extract properties from it
  const quoteData = quote || { id, text, author, category, likes };
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(quoteData.likes);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
    
    // If an external onLike handler is provided, call it
    if (onLike) {
      onLike();
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    polymathToast.resourceBookmarked();
  };

  return (
    <div 
      className="bg-[#1A1A1A] rounded-lg overflow-hidden flex flex-col enhanced-card hover-lift"
      style={animationDelay ? { animationDelay } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="w-full h-40 relative">
          <AspectRatio ratio={16/9}>
            <img 
              src={imageUrl} 
              alt={`Visual for quote by ${quoteData.author}`} 
              className="w-full h-full object-cover transition-transform duration-700"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-50"></div>
        </div>
      )}

      <div className="p-5 flex-grow">
        <div className="flex items-start mb-4">
          <div className="p-2 rounded-full bg-[#360036] mr-3">
            <Quote size={18} className="text-[#FF3EA5]" />
          </div>
          <span className="text-xs text-[#FF3EA5] font-medium bg-[#360036]/30 px-2 py-0.5 rounded">
            {quoteData.category}
          </span>
        </div>

        <blockquote className="text-white text-lg font-medium mb-4 italic">
          "{quoteData.text}"
        </blockquote>
        
        <div className="text-gray-400 text-sm mb-6">
          <span className="font-medium text-white">{quoteData.author}</span>
          {source && <span> • {source}</span>}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${liked ? 'text-blue-400' : 'text-gray-400'} hover:text-blue-400 transition-colors`}
            >
              <ThumbsUp size={16} className={liked ? "fill-blue-400" : ""} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              <MessageSquare size={16} />
              <span>{comments}</span>
            </button>
          </div>
          <button 
            onClick={handleBookmark}
            className={`p-1.5 rounded-full transition-all ${bookmarked ? 'bg-blue-900/30 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark quote"}
          >
            <BookmarkPlus size={18} className={bookmarked ? "fill-blue-400" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};
