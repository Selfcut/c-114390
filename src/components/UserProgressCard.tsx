
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { polymathToast } from "@/components/ui/use-toast";

interface UserProgressCardProps {
  title: string;
  progress: number;
  icon: "book" | "award" | "clock";
  description: string;
  className?: string;
  animationDelay?: string;
}

export const UserProgressCard = ({ 
  title, 
  progress, 
  icon, 
  description,
  className,
  animationDelay
}: UserProgressCardProps) => {
  const getIcon = () => {
    switch(icon) {
      case "book":
        return <BookOpen className="text-blue-400" size={20} />;
      case "award":
        return <Award className="text-purple-400" size={20} />;
      case "clock":
        return <Clock className="text-green-400" size={20} />;
      default:
        return <BookOpen className="text-blue-400" size={20} />;
    }
  };

  const handleClick = () => {
    polymathToast({
      title: "Progress Update",
      description: `Your progress on "${title}" was updated`,
    });
  };

  return (
    <div 
      className={cn(
        "bg-[#1A1A1A] rounded-lg p-5 hover-lift enhanced-card", 
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-gray-800">
          {getIcon()}
        </div>
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      
      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{description}</span>
        <span className="text-sm font-medium text-white">{progress}%</span>
      </div>
    </div>
  );
};
