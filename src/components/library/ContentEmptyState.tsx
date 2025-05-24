
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import { ContentType } from '@/types/unified-content-types';

interface ContentEmptyStateProps {
  contentType: ContentType;
  onRefresh: () => void;
  onCreateContent?: () => void;
}

export const ContentEmptyState: React.FC<ContentEmptyStateProps> = ({ 
  contentType, 
  onRefresh,
  onCreateContent 
}) => {
  const getEmptyMessage = () => {
    switch (contentType) {
      case ContentType.Quote:
        return 'No quotes found';
      case ContentType.Knowledge:
        return 'No knowledge entries found';
      case ContentType.Media:
        return 'No media posts found';
      case ContentType.Forum:
        return 'No forum posts found';
      case ContentType.Wiki:
        return 'No wiki articles found';
      case ContentType.Research:
        return 'No research papers found';
      case ContentType.AI:
        return 'No AI content found';
      default:
        return 'No content found';
    }
  };

  const getCreateLabel = () => {
    switch (contentType) {
      case ContentType.Quote:
        return 'Add Quote';
      case ContentType.Knowledge:
        return 'Create Entry';
      case ContentType.Media:
        return 'Upload Media';
      case ContentType.Forum:
        return 'Create Post';
      case ContentType.Wiki:
        return 'Create Article';
      default:
        return 'Create Content';
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{getEmptyMessage()}</h3>
        <p className="text-muted-foreground mb-6">
          {contentType === ContentType.All 
            ? "Content will appear here as it's created"
            : "Be the first to contribute!"
          }
        </p>
        <div className="flex gap-2">
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {onCreateContent && (
            <Button onClick={onCreateContent}>
              <Plus className="h-4 w-4 mr-2" />
              {getCreateLabel()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
