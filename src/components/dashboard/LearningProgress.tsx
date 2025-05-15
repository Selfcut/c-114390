
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Zap, Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressItemProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  recentActivity?: string;
  streakDays?: number;
}

interface LearningProgressProps {
  progressData: ProgressItemProps[];
  onCardClick: (item: ProgressItemProps) => void;
}

export const LearningProgress = ({ progressData, onCardClick }: LearningProgressProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Get icon component based on icon string
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return <BookOpen size={18} />;
      case 'brain':
        return <Zap size={18} />;
      case 'award':
        return <Award size={18} />;
      case 'target':
        return <Clock size={18} />;
      case 'trend':
      default:
        return <Zap size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {progressData.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "cursor-pointer border border-border overflow-hidden transition-all duration-200",
            hoveredId === item.id
              ? "border-primary/50 shadow-md transform scale-[1.02]"
              : "hover:border-primary/30"
          )}
          onClick={() => onCardClick(item)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {getIconComponent(item.icon)}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>

            {item.recentActivity && (
              <p className="text-xs text-muted-foreground mt-4">{item.recentActivity}</p>
            )}

            {item.streakDays !== undefined && (
              <div className="flex items-center mt-2">
                <Zap size={14} className="text-yellow-500 mr-1" />
                <span className="text-xs font-medium">{item.streakDays} day streak</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
