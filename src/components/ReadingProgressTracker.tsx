
import React from 'react';
import { BookOpen, Bookmark, Star } from 'lucide-react';

interface ReadingProgressTrackerProps {
  title: string;
  progress: number; // 0-100
  lastRead?: string;
  timeToComplete?: string;
}

export const ReadingProgressTracker = ({ 
  title, 
  progress, 
  lastRead,
  timeToComplete 
}: ReadingProgressTrackerProps) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-gray-800 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="bg-blue-900/30 rounded-full p-2 mr-3">
            <BookOpen size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {lastRead ? `Last read ${lastRead}` : 'New addition'} 
              {timeToComplete ? ` • ${timeToComplete} remaining` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Star size={18} />
          </button>
          <button className="text-gray-400 hover:text-blue-400 transition-colors">
            <Bookmark size={18} />
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-center text-blue-400 hover:bg-blue-900/20 rounded-md transition-colors">
        Continue Reading
      </button>
    </div>
  );
};
