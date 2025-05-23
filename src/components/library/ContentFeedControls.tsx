
import React from 'react';
import { Button } from '@/components/ui/button';
import { ContentTypeFilter, ContentType } from './ContentTypeFilter';
import { ViewSwitcher, ViewMode } from './ViewSwitcher';
import { RefreshCw } from 'lucide-react';

interface ContentFeedControlsProps {
  contentType: ContentType;
  viewMode: ViewMode;
  onContentTypeChange: (type: ContentType) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
}

export const ContentFeedControls: React.FC<ContentFeedControlsProps> = ({
  contentType,
  viewMode,
  onContentTypeChange,
  onViewModeChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
      <ContentTypeFilter 
        activeType={contentType} 
        onChange={onContentTypeChange} 
      />
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          aria-label="Refresh content"
        >
          <RefreshCw size={18} />
        </Button>
        
        <ViewSwitcher 
          activeView={viewMode} 
          onChange={onViewModeChange} 
        />
      </div>
    </div>
  );
};
