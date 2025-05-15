
import React from 'react';
import { ProgressCard } from "../ProgressCard";
import { BrainCircuit } from "lucide-react";

interface ProgressItem {
  id: string;
  title: string;
  description?: string;
  progress: number;
  icon: string;
  recentActivity?: string;
  streakDays?: number;
}

interface LearningProgressProps {
  progressData: ProgressItem[];
  onCardClick?: (item: ProgressItem) => void;
}

export const LearningProgress = ({ progressData, onCardClick }: LearningProgressProps) => {
  if (!progressData || progressData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full flex flex-col items-center justify-center p-8 bg-background/80 rounded-lg border border-border">
          <BrainCircuit size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Learning Progress Yet</h3>
          <p className="text-center text-muted-foreground">
            Start your learning journey by exploring topics and resources
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors"
            onClick={() => window.location.href = "/library"}
          >
            Explore Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {progressData.slice(0, 3).map((item) => (
        <ProgressCard
          key={item.id}
          title={item.title}
          description={item.description}
          progress={item.progress}
          icon={item.icon as any}
          recentActivity={item.recentActivity}
          streakDays={item.streakDays}
          onClick={() => onCardClick?.(item)}
        />
      ))}
      
      <div 
        className="bg-[#1A1A1A] hover:bg-[#232323] transition-colors rounded-lg p-4 flex flex-col gap-3 justify-center items-center cursor-pointer"
        onClick={() => window.location.href = "/library"}
      >
        <div className="p-3 rounded-full bg-blue-900">
          <BrainCircuit size={24} className="text-blue-400" />
        </div>
        <p className="text-center font-medium">Explore More Topics</p>
        <button className="mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm py-1.5 px-4 rounded">
          Browse All
        </button>
      </div>
    </div>
  );
};
