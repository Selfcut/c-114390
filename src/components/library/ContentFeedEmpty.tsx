
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContentFeedEmptyProps {
  onRefresh: () => void;
}

export const ContentFeedEmpty: React.FC<ContentFeedEmptyProps> = ({ onRefresh }) => {
  return (
    <div className="col-span-full text-center py-8">
      <p className="text-muted-foreground mb-4">No content found matching the selected filters.</p>
      <Button onClick={onRefresh}>Show all content</Button>
    </div>
  );
};
