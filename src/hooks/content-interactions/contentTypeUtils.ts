
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentTypeTables } from './types';

/**
 * Convert ContentItemType enum to string format used in database
 * @param type The ContentItemType enum
 * @returns A lowercase string representation of the content type
 */
export const getContentTypeString = (type: ContentItemType): string => {
  return type.toString().toLowerCase();
};

/**
 * Get all table and field information for a content type
 * @param contentType The string representation of the content type
 * @returns An object containing table names and field names
 */
export const getContentTypeInfo = (contentType: string): ContentTypeTables => {
  const isQuote = contentType === 'quote';
  
  return {
    contentTable: getContentTable(contentType),
    likesTable: isQuote ? 'quote_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    idFieldName: isQuote ? 'quote_id' : 'content_id',
    likesColumnName: contentType === 'forum' ? 'upvotes' : 'likes',
    bookmarksColumnName: isQuote ? 'bookmarks' : undefined
  };
};

/**
 * Get the table name for a content type
 * @param contentType The string representation of the content type
 * @returns The name of the table that stores this content type
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
    case 'research':
      return 'research_papers';
    case 'ai':
      return 'ai_content';
    default:
      console.warn(`Unknown content type: ${contentType}, defaulting to forum_posts`);
      return 'forum_posts';
  }
};

/**
 * Convert a raw content ID and type to a consistent format for state tracking
 */
export const getContentKey = (id: string, type: ContentItemType | string): string => {
  const contentType = typeof type === 'string' ? type : getContentTypeString(type);
  return `${contentType}:${id}`;
};
