
import { MessageSquare, ThumbsUp, Tag } from "lucide-react";
import { formatTimeAgo } from "../lib/discussions-utils";
import type { DiscussionTopic } from "../lib/discussions-utils";

interface DiscussionTopicCardProps {
  discussion: DiscussionTopic;
  onClick?: () => void;
}

export const DiscussionTopicCard = ({ discussion, onClick }: DiscussionTopicCardProps) => {
  const { title, author, replies, createdAt, tags, upvotes } = discussion;
  
  return (
    <div 
      className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-[#222222] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-[#00361F] flex items-center justify-center">
          <MessageSquare size={16} className="text-[#00A67E]" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-white">{title}</h3>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded flex items-center gap-1"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">
                {author}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MessageSquare size={12} /> {replies}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <ThumbsUp size={12} /> {upvotes}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
