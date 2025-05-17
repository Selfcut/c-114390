
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

// Determine content type for an item
export const getContentTypeString = (itemType: ContentItemType): string => {
  switch (itemType) {
    case 'knowledge':
      return 'knowledge';
    case 'media':
      return 'media';
    case 'quote':
      return 'quote';
    case 'wiki':
      return 'wiki';
    case 'ai':
      return 'ai';
    default:
      return 'knowledge';
  }
};

// Get the appropriate table name based on content type
export const getContentTable = (contentType: string): string => {
  switch (contentType) {
    case 'knowledge':
      return 'knowledge_entries';
    case 'media':
      return 'media_posts';
    case 'quote':
      return 'quotes';
    case 'wiki':
      return 'wiki_articles';
    case 'ai':
      return 'ai_content';
    default:
      return 'knowledge_entries';
  }
};
