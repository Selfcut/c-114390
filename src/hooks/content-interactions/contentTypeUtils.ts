
import { ContentType } from '@/types/contentTypes';

/**
 * Normalize content type to use with database operations
 * This ensures consistent representation regardless of the source enum
 */
export function normalizeContentType(type: string | ContentType): string {
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
      console.warn(`Unknown content type: ${normalizedType}, using as-is`);
      return normalizedType;
  }
}

/**
 * Get a consistent state key for content interactions
 */
export function getContentStateKey(id: string, type: string | ContentType): string {
  const normalizedType = normalizeContentType(type);
  return `${normalizedType}:${id}`;
}

/**
 * Create a consistent content key format for state tracking
 * Alias of getContentStateKey for backward compatibility
 */
export function getContentKey(id: string, type: string | ContentType): string {
  return getContentStateKey(id, type);
}
