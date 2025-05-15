
import React from "react";
import { ProgressCard } from "../ProgressCard";
import { RecommendationsRow } from "../RecommendationsRow";

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  recentActivity: string;
  streakDays?: number;
}

interface LearningProgressProps {
  progressData: ProgressItem[];
  onCardClick: (item: ProgressItem) => void;
}

export const LearningProgress = ({ progressData, onCardClick }: LearningProgressProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade animate-in">
        {progressData.map((item, index) => (
          <ProgressCard
            key={item.id}
            title={item.title}
            description={item.description}
            progress={item.progress}
            icon={item.icon as any}
            recentActivity={item.recentActivity}
            streakDays={item.streakDays}
            animationDelay={`${index * 0.1}s`}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
      <RecommendationsRow />
    </div>
  );
};
