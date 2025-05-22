
/**
 * Get the appropriate table name for a content type
 */
export const getContentTable = (contentType: string): string => {
  switch (contentType) {
    case 'quote':
      return 'quotes';
    case 'wiki':
      return 'wiki_articles';
    case 'media':
      return 'media_posts';
    case 'knowledge':
      return 'knowledge_entries';
    case 'forum':
      return 'forum_posts';
    case 'ai':
      return 'ai_content';
    default:
      return contentType;
  }
};

/**
 * Get the likes column name for a content type
 */
export const getContentColumnName = (contentType: string): string => {
  switch (contentType) {
    case 'forum':
      return 'upvotes';
    case 'quote':
    case 'wiki':
    case 'knowledge':
    case 'media':
    case 'ai':
      return 'likes';
    default:
      return 'likes';
  }
};
