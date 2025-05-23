
import React, { useState } from 'react';
import { UnifiedContentFeedComponent } from './UnifiedContentFeedComponent';
import { ContentTypeFilter } from './ContentTypeFilter';
import { ViewSwitcher } from './ViewSwitcher';
import { ContentType, ContentViewMode } from '@/types/unified-content-types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface UnifiedContentFeedProps {
  defaultContentType?: ContentType;
  defaultViewMode?: ContentViewMode;
}

export const UnifiedContentFeed: React.FC<UnifiedContentFeedProps> = ({ 
  defaultContentType = ContentType.All, 
  defaultViewMode = 'list' 
}) => {
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const [viewMode, setViewMode] = useState<ContentViewMode>(defaultViewMode);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Map our unified ContentType to the legacy ContentType for the filter
  const mapToLegacyType = (type: ContentType) => {
    switch (type) {
      case ContentType.All:
        return 'all';
      case ContentType.Knowledge:
        return 'knowledge';
      case ContentType.Media:
        return 'media';
      case ContentType.Quote:
        return 'quotes';
      case ContentType.Forum:
        return 'forum';
      case ContentType.Wiki:
        return 'wiki';
      case ContentType.AI:
        return 'ai';
      default:
        return 'all';
    }
  };

  const mapFromLegacyType = (type: string): ContentType => {
    switch (type) {
      case 'all':
        return ContentType.All;
      case 'knowledge':
        return ContentType.Knowledge;
      case 'media':
        return ContentType.Media;
      case 'quotes':
        return ContentType.Quote;
      case 'forum':
        return ContentType.Forum;
      case 'wiki':
        return ContentType.Wiki;
      case 'ai':
        return ContentType.AI;
      default:
        return ContentType.All;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ContentTypeFilter
            activeType={mapToLegacyType(contentType)}
            onTypeChange={(type) => setContentType(mapFromLegacyType(type))}
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
      />
    </div>
  );
};
