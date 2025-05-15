
import { MessageSquare, ThumbsUp, Tag, Users, Clock } from "lucide-react";
import { formatTimeAgo } from "../lib/discussions-utils";
import type { DiscussionTopic } from "../lib/discussions-utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DiscussionTopicCardProps {
  discussion: DiscussionTopic;
  onClick?: () => void;
}

export const DiscussionTopicCard = ({ discussion, onClick }: DiscussionTopicCardProps) => {
  const { title, author, replies, createdAt, tags, upvotes, excerpt } = discussion;
  
  // Generate avatar from author name if no avatar URL provided
  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Generate deterministic avatar URL based on author name
  const getAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };
  
  return (
    <div 
      className="bg-[#1A1A1A] rounded-lg p-5 hover:bg-[#222222] transition-colors cursor-pointer hover-lift"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-[#00361F] flex items-center justify-center">
          <MessageSquare size={18} className="text-[#00A67E]" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-white text-lg mb-2">{title}</h3>
          
          {excerpt && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{excerpt}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={getAvatarUrl(author)} alt={author} />
                <AvatarFallback>{getAvatarFallback(author)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-400 flex items-center">
                {author}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-xs flex items-center gap-1">
                <MessageSquare size={12} /> {replies}
              </span>
              <span className="text-xs flex items-center gap-1">
                <ThumbsUp size={12} /> {upvotes}
              </span>
              <span className="text-xs flex items-center gap-1">
                <Clock size={12} /> {formatTimeAgo(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
