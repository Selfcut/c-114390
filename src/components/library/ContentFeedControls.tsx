
import React from 'react';
import { ContentTypeFilter, type ContentType } from './ContentTypeFilter';
import { ViewSwitcher, type ViewMode } from './ViewSwitcher';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ContentFeedControlsProps {
  contentType: ContentType;
  viewMode: ViewMode;
  onContentTypeChange: (type: ContentType) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh?: () => void;
  className?: string;
}

export const ContentFeedControls: React.FC<ContentFeedControlsProps> = ({
  contentType,
  viewMode,
  onContentTypeChange,
  onViewModeChange,
  onRefresh,
  className
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between gap-4 ${className}`}>
      <ContentTypeFilter 
        activeType={contentType} 
        onChange={onContentTypeChange} 
        className="mb-2"
      />
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRefresh} 
            aria-label="Refresh content"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        <ViewSwitcher viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
};
