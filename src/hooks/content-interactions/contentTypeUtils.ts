
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Normalize content type to use with database operations
 * This ensures consistent representation regardless of the source enum
 */
export function normalizeContentType(type: string | ContentType | ContentItemType): string {
  // Handle various types of input
  let normalizedType: string;
  
  if (typeof type === 'string') {
    normalizedType = type.toLowerCase();
  } else {
    normalizedType = String(type).toLowerCase();
  }
  
  // Map types to ensure consistency
  switch (normalizedType) {
    case 'quotes':
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
      console.warn(`Unknown content type: ${normalizedType}, using as-is`);
      return normalizedType;
  }
}

/**
 * Get a consistent state key for content interactions
 */
export function getContentStateKey(id: string, type: string | ContentType | ContentItemType): string {
  const normalizedType = normalizeContentType(type);
  return `${normalizedType}:${id}`;
}

/**
 * Create a consistent content key format for state tracking
 * Alias of getContentStateKey for backward compatibility
 */
export function getContentKey(id: string, type: string | ContentType | ContentItemType): string {
  return getContentStateKey(id, type);
}
