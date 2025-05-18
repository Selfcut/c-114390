
import React, { useState, useEffect } from 'react';
import { ContentFeedControls } from './ContentFeedControls';
import { ContentFeed } from './ContentFeed';
import { ContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [lastRefresh, setLastRefresh] = useState<Date | undefined>(undefined);
  
  // Reset content type and view mode when props change
  useEffect(() => {
    if (defaultContentType !== contentType) {
      setContentType(defaultContentType);
    }
  }, [defaultContentType, contentType]);
  
  useEffect(() => {
    if (defaultViewMode !== viewMode) {
      setViewMode(defaultViewMode);
    }
  }, [defaultViewMode, viewMode]);
  
  // Handle refresh
  const handleRefresh = () => {
    setLastRefresh(new Date());
    toast({
      description: "Content refreshed",
    });
  };
  
  return (
    <div className="space-y-6">
      <ContentFeedControls
        contentType={contentType}
        viewMode={viewMode}
        onContentTypeChange={setContentType}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
      />
      
      <ContentFeed
        contentType={contentType}
        viewMode={viewMode}
        lastRefresh={lastRefresh}
      />
    </div>
  );
};
