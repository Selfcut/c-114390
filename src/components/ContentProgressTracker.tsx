
import { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'course';
  progress: number;
  totalItems?: number;
  completedItems?: number;
  startedAt?: Date;
  estimatedTimeLeft?: string;
}

interface ContentProgressTrackerProps {
  userId?: string;
  className?: string;
}

export const ContentProgressTracker = ({ userId, className }: ContentProgressTrackerProps) => {
  const [inProgressItems, setInProgressItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API or localStorage
    const loadProgressData = () => {
      setIsLoading(true);
      
      // Mocked progress data
      const mockData: ContentItem[] = [
        {
          id: '1',
          title: 'The Emerald Tablet: Core Teachings',
          type: 'article',
          progress: 45,
          startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          estimatedTimeLeft: '15 min'
        },
        {
          id: '2',
          title: 'Introduction to Sacred Geometry',
          type: 'course',
          progress: 68,
          totalItems: 12,
          completedItems: 8,
          startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          estimatedTimeLeft: '3 lessons'
        },
        {
          id: '3',
          title: 'The Origins of Alchemy',
          type: 'video',
          progress: 30,
          startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          estimatedTimeLeft: '25 min'
        },
        {
          id: '4',
          title: 'The Kybalion',
          type: 'book',
          progress: 80,
          totalItems: 15,
          completedItems: 12,
          startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          estimatedTimeLeft: '3 chapters'
        }
      ];
      
      setInProgressItems(mockData);
      setIsLoading(false);
    };
    
    // Simulate API call
    setTimeout(loadProgressData, 500);
  }, [userId]);
  
  const getIconForType = (type: ContentItem['type']) => {
    switch (type) {
      case 'article':
        return <BookOpen size={14} />;
      case 'video':
        return <Clock size={14} />;
      case 'book':
        return <BookOpen size={14} />;
      case 'course':
        return <CheckCircle size={14} />;
      default:
        return <BookOpen size={14} />;
    }
  };
  
  const getTypeLabel = (type: ContentItem['type']) => {
    switch (type) {
      case 'article':
        return 'Article';
      case 'video':
        return 'Video';
      case 'book':
        return 'Book';
      case 'course':
        return 'Course';
      default:
        return type;
    }
  };
  
  const getFormattedProgress = (item: ContentItem) => {
    if (item.totalItems && item.completedItems) {
      return `${item.completedItems}/${item.totalItems} ${item.type === 'book' ? 'chapters' : 'lessons'}`;
    }
    return `${item.progress}%`;
  };
  
  return (
    <div className={cn('bg-[#1A1A1A] rounded-lg border border-gray-800', className)}>
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Continue Learning</h3>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E59A5]"></div>
        </div>
      ) : inProgressItems.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {inProgressItems.map((item) => (
            <div key={item.id} className="p-5 hover:bg-[#222] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{item.title}</h4>
                <span className="bg-gray-800 text-xs text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {getIconForType(item.type)}
                  {getTypeLabel(item.type)}
                </span>
              </div>
              
              <div className="mb-2">
                <Progress value={item.progress} className="h-1.5" />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div>{getFormattedProgress(item)}</div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.estimatedTimeLeft} remaining</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <BookOpen size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-gray-400">No content in progress</p>
          <p className="text-gray-500 text-sm mt-1">Start exploring topics to begin your learning journey</p>
          
          <button className="mt-4 bg-[#6E59A5] hover:bg-[#7E69AB] text-white px-4 py-2 rounded transition-colors">
            Browse Content
          </button>
        </div>
      )}
      
      {inProgressItems.length > 0 && (
        <div className="p-4 border-t border-gray-800">
          <button className="text-[#6E59A5] hover:text-[#7E69AB] font-medium transition-colors text-sm w-full text-center">
            View All In Progress (7)
          </button>
        </div>
      )}
    </div>
  );
};
