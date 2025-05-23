
/**
 * Unified content type system to ensure consistency across the application
 */
export enum ContentType {
  All = 'all',
  Knowledge = 'knowledge',
  Media = 'media',
  Quote = 'quote',
  Forum = 'forum',
  Wiki = 'wiki',
  AI = 'ai',
  Research = 'research'
}

/**
 * Map UI content type to database content type
 */
export const mapUItoDBContentType = (uiType: string): string => {
  const normalizedType = typeof uiType === 'string' ? uiType.toLowerCase() : '';
  
  switch (normalizedType) {
    case 'all':
      return 'all';
    case 'quotes':
      return 'quote';
    case 'knowledge':
      return 'knowledge';
    case 'media':
      return 'media';
    case 'ai':
      return 'ai';
    case 'forum':
      return 'forum';
    case 'wiki':
      return 'wiki';
    case 'research':
      return 'research';
    default:
      return normalizedType;
  }
};

/**
 * Type guard to check if a string is a valid ContentType
 */
export function isValidContentType(type: string): type is ContentType {
  return Object.values(ContentType).includes(type as ContentType);
}

/**
 * Get database table name for a content type
 */
export function getContentTableName(type: ContentType | string): string {
  const normalizedType = typeof type === 'string' ? type.toLowerCase() : type.toLowerCase();
  
  switch (normalizedType) {
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
      return 'content';
  }
}

/**
 * Content table information interface
 */
export interface ContentTypeInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  likesColumnName: string;
  bookmarksColumnName?: string;
}

/**
 * Get content type information for database operations
 */
export function getContentTypeInfo(type: ContentType | string): ContentTypeInfo {
  const normalizedType = typeof type === 'string' ? type.toLowerCase() : type.toLowerCase();
  const isQuote = normalizedType === ContentType.Quote.toLowerCase();
  
  return {
    contentTable: getContentTableName(normalizedType),
    likesTable: isQuote ? 'quote_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    likesColumnName: normalizedType === ContentType.Forum.toLowerCase() ? 'upvotes' : 'likes',
    bookmarksColumnName: 'bookmarks'
  };
}
