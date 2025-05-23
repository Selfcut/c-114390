
import React from 'react';
import { Button } from '@/components/ui/button';
import { ContentTypeFilter } from './ContentTypeFilter';
import { ViewSwitcher } from './ViewSwitcher';
import { ContentViewMode } from '@/types/unified-content-types';
import { RefreshCw } from 'lucide-react';

interface ContentFeedControlsProps {
  contentType: string;
  viewMode: ContentViewMode;
  onContentTypeChange: (type: string) => void;
  onViewModeChange: (mode: ContentViewMode) => void;
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
        onTypeChange={onContentTypeChange} 
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
          activeMode={viewMode} 
          onModeChange={onViewModeChange} 
        />
      </div>
    </div>
  );
};
