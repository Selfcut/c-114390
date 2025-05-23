
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType, getContentTypeInfo as getTypeInfo } from '@/types/contentTypes';
import { ContentTypeTables } from './types';

/**
 * Convert ContentItemType enum to string format used in database
 * This function safely handles both string and enum inputs
 * @param type The ContentItemType enum
 * @returns A lowercase string representation of the content type
 */
export const getContentTypeString = (type: ContentItemType): string => {
  // Ensure we're working with a string before calling toLowerCase
  // Since ContentItemType is an enum of string values, we can safely cast it
  const typeString = String(type);
  return typeString.toLowerCase();
};

/**
 * Get all table and field information for a content type
 * @param contentType The string representation of the content type
 * @returns An object containing table names and field names
 */
export const getContentTypeInfo = (contentType: string): ContentTypeTables => {
  const typeInfo = getTypeInfo(contentType);
  
  return {
    contentTable: typeInfo.contentTable,
    likesTable: typeInfo.likesTable,
    bookmarksTable: typeInfo.bookmarksTable,
    idFieldName: typeInfo.idFieldName,
    likesColumnName: typeInfo.likesColumnName,
    bookmarksColumnName: typeInfo.bookmarksColumnName
  };
};

/**
 * Get the table name for a content type
 * @param contentType The string representation of the content type
 * @returns The name of the table that stores this content type
 */
export const getContentTableName = (contentType: string): string => {
  const { contentTable } = getTypeInfo(contentType);
  return contentTable;
};

/**
 * Convert a raw content ID and type to a consistent format for state tracking
 * Safely handles both string and enum inputs for content type
 */
export const getContentKey = (id: string, type: ContentItemType | string): string => {
  // Ensure we're working with a string before further manipulation
  const contentType = typeof type === 'string' ? type : String(type);
  return `${contentType.toLowerCase()}:${id}`;
};
