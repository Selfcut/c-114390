
import { BookOpen, ChevronRight } from "lucide-react";

interface UserProgressCardProps {
  discipline: string;
  progress: number;
  nextMilestone: string;
  daysStreak: number;
}

export const UserProgressCard = ({
  discipline,
  progress,
  nextMilestone,
  daysStreak
}: UserProgressCardProps) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 hover-lift">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-medium">{discipline}</h3>
        <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full">
          {daysStreak} day streak
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <BookOpen size={14} className="text-blue-400 mr-1.5" />
          <span className="text-gray-300">Next: {nextMilestone}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
