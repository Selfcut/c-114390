
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, Brain, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  description?: string;
  progress: number;
  icon?: "book" | "award" | "clock" | "brain" | "target" | "trend";
  className?: string;
  animationDelay?: string;
  recentActivity?: string;
  streakDays?: number;
  className2?: string;
  onClick?: () => void;
}

export const ProgressCard = ({
  title,
  description,
  progress,
  icon = "book",
  className,
  animationDelay,
  recentActivity,
  streakDays,
  onClick
}: ProgressCardProps) => {
  const renderIcon = () => {
    switch(icon) {
      case "book":
        return <BookOpen className="text-[#6E59A5]" size={20} />;
      case "award":
        return <Award className="text-purple-400" size={20} />;
      case "clock":
        return <Clock className="text-green-400" size={20} />;
      case "brain":
        return <Brain className="text-blue-400" size={20} />;
      case "target":
        return <Target className="text-orange-400" size={20} />;
      case "trend":
        return <TrendingUp className="text-teal-400" size={20} />;
      default:
        return <BookOpen className="text-[#6E59A5]" size={20} />;
    }
  };

  return (
    <Card
      className={cn(
        "bg-[#1A1A1A] border-gray-800 hover:border-gray-700 transition-all overflow-hidden hover-lift",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 rounded-full bg-gray-800">
            {renderIcon()}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {description && (
          <p className="text-sm text-gray-400 mb-4">{description}</p>
        )}
        
        <div className="mb-2">
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{progress}% complete</span>
          {streakDays !== undefined && streakDays > 0 && (
            <div className="flex items-center gap-1.5">
              <Award size={14} className="text-yellow-500" />
              <span className="text-sm text-yellow-400">{streakDays} day streak</span>
            </div>
          )}
        </div>
        
        {recentActivity && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-400">Recent activity</p>
            <p className="text-sm text-gray-300 mt-1">{recentActivity}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
