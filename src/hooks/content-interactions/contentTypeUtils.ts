
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType, getContentTypeInfo as getTypeInfo } from '@/types/contentTypes';
import { ContentTypeTables } from './types';

/**
 * Convert any content type representation to a standard string format
 * Safely handles ContentType enum, ContentItemType enum, or string inputs
 * @param type The content type (can be string, ContentType enum, or ContentItemType enum)
 * @returns A normalized lowercase string representation
 */
export const normalizeContentType = (type: string | ContentType | ContentItemType): string => {
  // Ensure we're working with a string before further manipulation
  return String(type).toLowerCase();
};

/**
 * Get all table and field information for a content type
 * @param contentType The content type (can be string, ContentType enum, or ContentItemType enum)
 * @returns An object containing table names and field names
 */
export const getContentTypeInfo = (contentType: string | ContentType | ContentItemType): ContentTypeTables => {
  const typeStr = normalizeContentType(contentType);
  return getTypeInfo(typeStr);
};

/**
 * Get the table name for a content type
 * @param contentType The content type (can be string, ContentType enum, or ContentItemType enum)
 * @returns The name of the table that stores this content type
 */
export const getContentTableName = (contentType: string | ContentType | ContentItemType): string => {
  const { contentTable } = getTypeInfo(normalizeContentType(contentType));
  return contentTable;
};

/**
 * Convert a raw content ID and type to a consistent format for state tracking
 */
export const getContentKey = (id: string, type: string | ContentType | ContentItemType): string => {
  const contentType = normalizeContentType(type);
  return `${contentType}:${id}`;
};

/**
 * Get likes column name for a content type
 */
export const getLikeColumnName = (contentType: string | ContentType | ContentItemType): string => {
  const typeStr = normalizeContentType(contentType);
  return typeStr === 'forum' ? 'upvotes' : 'likes';
};
