
import { BookOpen, Award, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserProgressCardProps {
  discipline: string;
  progress: number;
  nextMilestone: string;
  daysStreak: number;
}

export const UserProgressCard = ({ discipline, progress, nextMilestone, daysStreak }: UserProgressCardProps) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">{discipline}</h3>
        <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded-full">
          {daysStreak} day streak
        </span>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Award size={14} />
          <span>Next: {nextMilestone}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-400">
          <TrendingUp size={14} />
          <span>+5% this week</span>
        </div>
      </div>
    </div>
  );
};
