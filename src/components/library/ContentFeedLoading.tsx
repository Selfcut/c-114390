
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ContentFeedLoadingProps {
  initial?: boolean;
}

export const ContentFeedLoading: React.FC<ContentFeedLoadingProps> = ({ initial = false }) => {
  if (initial) {
    return null; // ContentFeedSkeleton will be shown for initial loading
  }
  
  return (
    <div className="text-center py-4">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const LoadMoreButton: React.FC<{
  isLoading: boolean;
  onClick: () => void;
}> = ({ isLoading, onClick }) => {
  return (
    <div className="text-center pt-4">
      <Button 
        variant="outline" 
        onClick={onClick} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Loading...' : 'Load More'}
      </Button>
    </div>
  );
};
