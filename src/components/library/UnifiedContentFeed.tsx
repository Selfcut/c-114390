
import React, { useState } from 'react';
import { ContentFeedControls } from './ContentFeedControls';
import { ContentFeed } from './ContentFeed';
import { ContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';

interface UnifiedContentFeedProps {
  defaultContentType?: ContentType;
  defaultViewMode?: ViewMode;
}

export const UnifiedContentFeed = ({ 
  defaultContentType = 'all', 
  defaultViewMode = 'list' 
}: UnifiedContentFeedProps) => {
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  
  return (
    <div className="space-y-6">
      <ContentFeedControls
        contentType={contentType}
        viewMode={viewMode}
        onContentTypeChange={setContentType}
        onViewModeChange={setViewMode}
      />
      
      <ContentFeed
        contentType={contentType}
        viewMode={viewMode}
      />
    </div>
  );
};
