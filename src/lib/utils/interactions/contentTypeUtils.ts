
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Convert a ContentItemType to its string representation for database use
 */
export const getContentTypeString = (itemType: ContentItemType): string => {
  switch (itemType) {
    case ContentItemType.Quote:
      return 'quote';
    case ContentItemType.Forum:
      return 'forum';
    case ContentItemType.Media:
      return 'media';
    case ContentItemType.Wiki:
      return 'wiki';
    case ContentItemType.Knowledge:
      return 'knowledge';
    case ContentItemType.AI:
      return 'ai';
    default:
      return 'quote'; // Default to quote as a fallback
  }
};

/**
 * Get the database table name for a content type
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
      return 'quotes'; // Default to quotes table as a fallback
  }
};
