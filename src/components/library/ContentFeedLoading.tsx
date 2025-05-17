
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader, ArrowDown } from 'lucide-react';

interface ContentFeedLoadingProps {
  className?: string;
}

export const ContentFeedLoading: React.FC<ContentFeedLoadingProps> = ({ className }) => {
  return (
    <div className={`w-full flex justify-center py-8 ${className}`}>
      <div className="flex flex-col items-center">
        <Loader className="h-6 w-6 animate-spin mb-2" />
        <span className="text-sm text-muted-foreground">Loading content...</span>
      </div>
    </div>
  );
};

interface LoadMoreButtonProps {
  isLoading: boolean;
  onClick: () => void;
  className?: string;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isLoading, onClick, className }) => {
  return (
    <div className={`w-full flex justify-center mt-6 ${className}`}>
      <Button 
        variant="outline" 
        onClick={onClick} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowDown size={16} />
        )}
        <span>{isLoading ? 'Loading...' : 'Load More'}</span>
      </Button>
    </div>
  );
};
