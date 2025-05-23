
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Standardized content types for consistent usage across the application
 * This provides proper TypeScript type safety and intellisense
 */
export enum ContentType {
  Forum = 'forum',
  Quote = 'quote',
  Media = 'media',
  Wiki = 'wiki',
  Knowledge = 'knowledge',
  Research = 'research',
  AI = 'ai'
}

// Re-export ContentItemType for consistency in imports
export { ContentItemType };

/**
 * Type guard to check if a string is a valid ContentType
 */
export function isValidContentType(type: string): type is ContentType {
  return Object.values(ContentType).includes(type as ContentType);
}

/**
 * Convert a ContentType enum to string
 * No toString() call needed since enum values are already strings
 */
export function contentTypeToString(type: ContentType | string): string {
  return typeof type === 'string' ? type : type;
}

/**
 * Get the database table name for a content type
 */
export function getContentTable(type: ContentType | string): string {
  const contentType = typeof type === 'string' ? type : type;
  
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
      console.warn(`Unknown content type: ${contentType}, defaulting to forum_posts`);
      return 'forum_posts';
  }
}

/**
 * Create a consistent content key format for state tracking
 */
export function getContentKey(id: string, type: ContentType | string): string {
  const contentType = typeof type === 'string' ? type : type;
  return `${contentType}:${id}`;
}

/**
 * Get content type from a content key
 */
export function getTypeFromKey(key: string): string | null {
  const parts = key.split(':');
  return parts.length > 1 ? parts[0] : null;
}

/**
 * Get content ID from a content key
 */
export function getIdFromKey(key: string): string | null {
  const parts = key.split(':');
  return parts.length > 1 ? parts[1] : null;
}

/**
 * Information about content tables and fields
 */
export interface ContentTableInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  idFieldName: string;
  likesColumnName: string;
  bookmarksColumnName?: string;
}

/**
 * Get all table and field information for a content type
 */
export function getContentTypeInfo(contentType: ContentType | string): ContentTableInfo {
  const typeStr = typeof contentType === 'string' ? contentType.toLowerCase() : contentType;
  const isQuote = typeStr === ContentType.Quote;
  
  return {
    contentTable: getContentTable(typeStr),
    likesTable: isQuote ? 'quote_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    idFieldName: isQuote ? 'quote_id' : 'content_id',
    likesColumnName: typeStr === ContentType.Forum ? 'upvotes' : 'likes',
    bookmarksColumnName: isQuote ? 'bookmarks' : undefined
  };
}
