
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ContentFeedEmptyProps {
  onRefresh: () => void;
}

export const ContentFeedEmpty: React.FC<ContentFeedEmptyProps> = ({ onRefresh }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl">🔍</div>
      <h3 className="text-xl font-semibold mb-2">No content found</h3>
      <p className="text-muted-foreground mb-4">
        We couldn't find any content matching your criteria.
      </p>
      <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
        <RefreshCw size={16} />
        <span>Refresh</span>
      </Button>
    </div>
  );
};
