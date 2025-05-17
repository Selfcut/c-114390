
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ContentFeedLoading: React.FC = () => {
  return (
    <div className="flex justify-center pt-8 pb-4 w-full">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
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
    <div className="flex justify-center pt-8 pb-4 w-full">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-[150px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </>
        ) : (
          'Load More'
        )}
      </Button>
    </div>
  );
};
