
import { ContentType, ContentItemType } from '@/types/contentTypes';

/**
 * Normalizes content type from any representation to a standard string format
 * @param contentType Any representation of content type (enum value, string, etc.)
 * @returns Standardized string representation of the content type
 */
export const normalizeContentType = (contentType: string | ContentType | ContentItemType): string => {
  // Always convert to lowercase string for consistency
  return String(contentType).toLowerCase();
};

/**
 * Get database table information for a specific content type
 * @param contentType The content type to get table info for
 * @returns Object containing table names and field names
 */
export interface ContentTableInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  contentIdField: string;
  likesColumnName: string;
  bookmarksColumnName?: string;
}

/**
 * Get database table information for a content type
 */
export const getContentTableInfo = (contentType: string | ContentType | ContentItemType): ContentTableInfo => {
  const normalizedType = normalizeContentType(contentType);
  const isQuote = normalizedType === 'quote';
  
  // Determine the appropriate tables and field names based on content type
  return {
    contentTable: getContentTableName(normalizedType),
    likesTable: isQuote ? 'quote_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    contentIdField: isQuote ? 'quote_id' : 'content_id',
    likesColumnName: normalizedType === 'forum' ? 'upvotes' : 'likes',
    bookmarksColumnName: 'bookmarks'
  };
};

/**
 * Get the content table name for a specific content type
 */
export const getContentTableName = (contentType: string | ContentType | ContentItemType): string => {
  const normalizedType = normalizeContentType(contentType);
  
  switch (normalizedType) {
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
    case 'research':
      return 'research_papers';
    case 'ai':
      return 'ai_content';
    default:
      console.warn(`Unknown content type: ${normalizedType}, defaulting to forum_posts`);
      return 'forum_posts';
  }
};

/**
 * Generate a unique key for content state tracking
 */
export const getContentStateKey = (id: string, type: string | ContentType | ContentItemType): string => {
  return `${normalizeContentType(type)}:${id}`;
};

/**
 * Get content ID from a content state key
 */
export const getIdFromStateKey = (key: string): string => {
  const parts = key.split(':');
  return parts.length > 1 ? parts[1] : '';
};

/**
 * Get content type from a content state key
 */
export const getTypeFromStateKey = (key: string): string => {
  const parts = key.split(':');
  return parts.length > 1 ? parts[0] : '';
};
