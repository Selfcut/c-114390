
import { ArrowRight } from 'lucide-react';

interface TopicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  videoCount?: number;
  onClick?: () => void;
}

export const TopicCard = ({ title, description, icon, videoCount, onClick }: TopicCardProps) => {
  return (
    <div 
      className="bg-[#1A1A1A] rounded-lg p-5 hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start mb-3">
        <div className="p-2 rounded-lg bg-[#360036] mr-3 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          {videoCount !== undefined && (
            <span className="text-xs text-gray-400">{videoCount} videos</span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
      <div className="flex justify-end">
        <button className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors">
          <span>Explore</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
