
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const ContentFeedLoading: React.FC = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 size={18} className="animate-spin" />
        <span>Loading more content...</span>
      </div>
    </div>
  );
};

interface LoadMoreButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isLoading, onClick }) => {
  return (
    <div className="flex justify-center py-6">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        <span>{isLoading ? 'Loading...' : 'Load more'}</span>
      </Button>
    </div>
  );
};
