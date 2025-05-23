
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
  switch (uiType.toLowerCase()) {
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
      return uiType.toLowerCase();
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
  const contentType = typeof type === 'string' ? type.toLowerCase() : type.toLowerCase();
  
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
      return 'content';
  }
}
