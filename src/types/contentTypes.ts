
// Unified content types to replace scattered definitions
export { ContentType, ContentViewMode } from './unified-content-types';

// Re-export for backward compatibility
export type { UnifiedContentItem as ContentItem } from './unified-content-types';

// Import ContentType for use in this file
import { ContentType } from './unified-content-types';

// Utility functions for content type handling
export const isValidContentType = (type: string): type is ContentType => {
  return Object.values(ContentType).includes(type as ContentType);
};

export const normalizeContentType = (type: string | ContentType): ContentType => {
  if (isValidContentType(type)) {
    return type;
  }
  console.warn(`Invalid content type: ${type}, defaulting to 'forum'`);
  return ContentType.Forum;
};

export interface ContentTypeInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  contentIdField: string;
  likesColumnName: string;
  bookmarksColumnName: string;
}

export const getContentTypeInfo = (contentType: ContentType): ContentTypeInfo => {
  const isQuote = contentType === ContentType.Quote;
  const isMedia = contentType === ContentType.Media;
  
  return {
    contentTable: getContentTableName(contentType),
    likesTable: isQuote ? 'quote_likes' : isMedia ? 'media_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    contentIdField: isQuote ? 'quote_id' : isMedia ? 'post_id' : 'content_id',
    likesColumnName: contentType === ContentType.Forum ? 'upvotes' : 'likes',
    bookmarksColumnName: 'bookmarks'
  };
};

export const getContentTableName = (contentType: ContentType): string => {
  switch (contentType) {
    case ContentType.Quote:
      return 'quotes';
    case ContentType.Forum:
      return 'forum_posts';
    case ContentType.Media:
      return 'media_posts';
    case ContentType.Wiki:
      return 'wiki_articles';
    case ContentType.Knowledge:
      return 'knowledge_entries';
    case ContentType.Research:
      return 'research_papers';
    case ContentType.AI:
      return 'ai_content';
    default:
      return 'forum_posts';
  }
};
