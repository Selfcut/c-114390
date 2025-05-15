
import { Book, BookOpen, Calendar, Tag } from "lucide-react";
import { formatTimeAgo } from "../lib/discussions-utils";

interface KnowledgeEntryCardProps {
  title: string;
  author: string;
  readTime: string;
  createdAt: Date;
  summary: string;
  categories: string[];
  coverImage?: string;
  onClick?: () => void;
}

export const KnowledgeEntryCard = ({
  title,
  author,
  readTime,
  createdAt,
  summary,
  categories,
  coverImage,
  onClick
}: KnowledgeEntryCardProps) => {
  return (
    <div 
      className="bg-[#1A1A1A] rounded-lg overflow-hidden flex flex-col md:flex-row hover:bg-[#222222] transition-colors cursor-pointer"
      onClick={onClick}
    >
      {coverImage && (
        <div className="w-full md:w-48 h-40 md:h-auto">
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{summary}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((category, index) => (
            <span 
              key={index} 
              className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded flex items-center gap-1"
            >
              <Tag size={10} />
              {category}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              {author}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <BookOpen size={12} /> 
              {readTime}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> 
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
