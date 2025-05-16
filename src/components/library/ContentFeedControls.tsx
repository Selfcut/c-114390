
import React from 'react';
import { ContentTypeFilter, type ContentType } from './ContentTypeFilter';
import { ViewSwitcher, type ViewMode } from './ViewSwitcher';

interface ContentFeedControlsProps {
  contentType: ContentType;
  viewMode: ViewMode;
  onContentTypeChange: (type: ContentType) => void;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export const ContentFeedControls: React.FC<ContentFeedControlsProps> = ({
  contentType,
  viewMode,
  onContentTypeChange,
  onViewModeChange,
  className
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between gap-4 ${className}`}>
      <ContentTypeFilter 
        activeType={contentType} 
        onChange={onContentTypeChange} 
        className="mb-2"
      />
      <ViewSwitcher viewMode={viewMode} onChange={onViewModeChange} />
    </div>
  );
};
