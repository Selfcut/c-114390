
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType, getContentTable, getContentTypeInfo as getTypeInfo } from '@/types/contentTypes';
import { ContentTypeTables } from './types';

/**
 * Convert ContentItemType enum to string format used in database
 * @param type The ContentItemType enum
 * @returns A lowercase string representation of the content type
 */
export const getContentTypeString = (type: ContentItemType): string => {
  return type.toString().toLowerCase();
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
export const getContentTable = (contentType: string): string => {
  return getContentTable(contentType);
};

/**
 * Convert a raw content ID and type to a consistent format for state tracking
 */
export const getContentKey = (id: string, type: ContentItemType | string): string => {
  const contentType = typeof type === 'string' ? type : getContentTypeString(type);
  return `${contentType}:${id}`;
};
