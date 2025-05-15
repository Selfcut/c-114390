
import { MessageSquare } from "lucide-react";

interface DiscussionTopicItemProps {
  title: string; 
  author: string; 
  replies: number; 
  timeAgo: string;
}

export const DiscussionTopicItem = ({ title, author, replies, timeAgo }: DiscussionTopicItemProps) => (
  <div className="flex items-start gap-3 pb-4 border-b border-gray-800">
    <div className="p-2 rounded-full bg-[#00361F]">
      <MessageSquare size={16} className="text-[#00A67E]" />
    </div>
    <div>
      <h4 className="text-white font-medium text-sm">{title}</h4>
      <p className="text-xs text-gray-400 mt-1">
        {author} • {replies} replies • {timeAgo}
      </p>
    </div>
  </div>
);
