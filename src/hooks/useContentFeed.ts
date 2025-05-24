
import { ContentViewMode, ContentType, UnifiedContentItem } from '@/types/unified-content-types';
import { useUnifiedContentFeed } from './content-feed/useUnifiedContentFeed';

// Export ContentFeedItem for backward compatibility
export type ContentFeedItem = UnifiedContentItem;

// Wrapper hook for backward compatibility
export const useContentFeed = (
  contentType: ContentType = ContentType.All,
  viewMode: ContentViewMode = 'list'
) => {
  return useUnifiedContentFeed(contentType, viewMode);
};
