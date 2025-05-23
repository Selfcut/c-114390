
import React, { useState } from 'react';
import { UnifiedContentFeedComponent } from './UnifiedContentFeedComponent';
import { ContentTypeFilter } from './ContentTypeFilter';
import { ViewSwitcher } from './ViewSwitcher';
import { ContentType, ContentViewMode, ContentTypeValues } from '@/types/unified-content-types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface UnifiedContentFeedProps {
  defaultContentType?: ContentType;
  defaultViewMode?: ContentViewMode;
  onCreateContent?: () => void;
}

export const UnifiedContentFeed: React.FC<UnifiedContentFeedProps> = ({ 
  defaultContentType = ContentTypeValues.All, 
  defaultViewMode = 'list',
  onCreateContent
}) => {
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const [viewMode, setViewMode] = useState<ContentViewMode>(defaultViewMode);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Map our unified ContentType to the string values expected by ContentTypeFilter
  const mapToFilterType = (type: ContentType): string => {
    switch (type) {
      case ContentTypeValues.All:
        return 'all';
      case ContentTypeValues.Knowledge:
        return 'knowledge';
      case ContentTypeValues.Media:
        return 'media';
      case ContentTypeValues.Quote:
        return 'quote';
      case ContentTypeValues.Forum:
        return 'forum';
      case ContentTypeValues.Wiki:
        return 'wiki';
      case ContentTypeValues.AI:
        return 'ai';
      default:
        return 'all';
    }
  };

  const mapFromFilterType = (type: string): ContentType => {
    switch (type) {
      case 'all':
        return ContentTypeValues.All;
      case 'knowledge':
        return ContentTypeValues.Knowledge;
      case 'media':
        return ContentTypeValues.Media;
      case 'quote':
        return ContentTypeValues.Quote;
      case 'forum':
        return ContentTypeValues.Forum;
      case 'wiki':
        return ContentTypeValues.Wiki;
      case 'ai':
        return ContentTypeValues.AI;
      default:
        return ContentTypeValues.All;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ContentTypeFilter
            activeType={mapToFilterType(contentType)}
            onTypeChange={(type) => setContentType(mapFromFilterType(type))}
          />
          <ViewSwitcher
            activeMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <UnifiedContentFeedComponent
        key={refreshKey}
        contentType={contentType}
        viewMode={viewMode}
        onCreateContent={onCreateContent}
      />
    </div>
  );
};
