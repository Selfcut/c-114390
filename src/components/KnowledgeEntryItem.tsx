
import { Book } from "lucide-react";

interface KnowledgeEntryItemProps {
  title: string; 
  author: string; 
  readTime: string; 
  timeAgo: string;
}

export const KnowledgeEntryItem = ({ title, author, readTime, timeAgo }: KnowledgeEntryItemProps) => {
  console.log('KnowledgeEntryItem styles check');
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-800 w-full">
      <div className="p-2 rounded-full bg-[#360036] flex-shrink-0">
        <Book size={16} className="text-[#FF3EA5]" />
      </div>
      <div className="overflow-hidden flex-grow w-full">
        <h4 className="text-white font-medium text-sm truncate">{title}</h4>
        <p className="text-xs text-gray-400 mt-1 truncate">
          {author} • {readTime} • {timeAgo}
        </p>
      </div>
    </div>
  );
};
