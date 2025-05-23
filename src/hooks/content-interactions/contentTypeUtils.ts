
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Convert ContentItemType enum to string format used in database
 */
export const getContentTypeString = (type: ContentItemType): string => {
  return type.toString().toLowerCase();
};

/**
 * Get the table name for a content type
 */
export const getContentTable = (contentType: string): string => {
  switch (contentType) {
    case 'quote':
      return 'quotes';
    case 'forum':
      return 'forum_posts';
    case 'media':
      return 'media_posts';
    case 'wiki':
      return 'wiki_articles';
    case 'knowledge':
      return 'knowledge_entries';
    case 'ai':
      return 'ai_content';
    default:
      // Default to forum_posts as a fallback
      return 'forum_posts';
  }
};

/**
 * Determine if a content type uses quote-specific tables for interactions
 */
export const usesQuoteTables = (contentType: string): boolean => {
  return contentType === 'quote';
};

/**
 * Get the ID field name based on content type
 */
export const getIdFieldName = (contentType: string): string => {
  return contentType === 'quote' ? 'quote_id' : 'content_id';
};

/**
 * Get the likes table name for a given content type
 */
export const getLikesTable = (contentType: string): string => {
  return contentType === 'quote' ? 'quote_likes' : 'content_likes';
};

/**
 * Get the bookmarks table name for a given content type
 */
export const getBookmarksTable = (contentType: string): string => {
  return contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
};
