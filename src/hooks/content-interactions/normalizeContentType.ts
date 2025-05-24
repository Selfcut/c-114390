
import { ContentType } from '@/types/unified-content-types';

/**
 * Normalize content type to ensure consistency across the application
 */
export const normalizeContentType = (contentType: string | ContentType): string => {
  if (!contentType) return 'forum';
  
  const normalized = String(contentType).toLowerCase();
  
  switch (normalized) {
    case 'quotes':
    case 'quote':
      return 'quote';
    case 'media':
      return 'media';
    case 'knowledge':
      return 'knowledge';
    case 'wiki':
      return 'wiki';
    case 'forum':
      return 'forum';
    case 'research':
      return 'research';
    case 'ai':
      return 'ai';
    default:
      console.warn(`Unknown content type: ${normalized}, defaulting to forum`);
      return 'forum';
  }
};

/**
 * Convert normalized content type to enum value
 */
export const getContentTypeEnum = (contentType: string): ContentType => {
  const normalized = normalizeContentType(contentType);
  
  switch (normalized) {
    case 'quote':
      return ContentType.Quote;
    case 'media':
      return ContentType.Media;
    case 'knowledge':
      return ContentType.Knowledge;
    case 'wiki':
      return ContentType.Wiki;
    case 'forum':
      return ContentType.Forum;
    case 'research':
      return ContentType.Research;
    case 'ai':
      return ContentType.AI;
    default:
      return ContentType.Forum;
  }
};
