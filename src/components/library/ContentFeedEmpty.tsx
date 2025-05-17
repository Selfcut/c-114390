
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Library } from 'lucide-react';

interface ContentFeedEmptyProps {
  onRefresh: () => void;
}

export const ContentFeedEmpty: React.FC<ContentFeedEmptyProps> = ({ onRefresh }) => {
  return (
    <Card className="col-span-full w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Library className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No content found</h3>
        <p className="text-muted-foreground text-center max-w-md mx-auto mb-6">
          There's no content matching your current filters. Try changing your filters or refresh to check for new content.
        </p>
        <Button onClick={onRefresh} className="flex items-center gap-2">
          <RefreshCw size={16} />
          <span>Refresh Content</span>
        </Button>
      </CardContent>
    </Card>
  );
};
