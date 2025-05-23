
import { ContentType, ContentItemType } from '@/types/contentTypes';

export const normalizeContentType = (contentType: string | ContentType | ContentItemType): string => {
  if (!contentType) return 'default';
  return String(contentType).toLowerCase();
};

export interface ContentTableInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  contentIdField: string;
  likesColumnName: string;
  bookmarksColumnName?: string;
}

export const getContentTableInfo = (contentType: string | ContentType | ContentItemType): ContentTableInfo => {
  const normalizedType = normalizeContentType(contentType);
  const isQuote = normalizedType === 'quote';
  
  return {
    contentTable: getContentTableName(normalizedType),
    likesTable: isQuote ? 'quote_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    contentIdField: isQuote ? 'quote_id' : 'content_id',
    likesColumnName: normalizedType === 'forum' ? 'upvotes' : 'likes',
    bookmarksColumnName: 'bookmarks'
  };
};

export const getContentTableName = (contentType: string | ContentType | ContentItemType): string => {
  const normalizedType = normalizeContentType(contentType);
  
  switch (normalizedType) {
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
    case 'research':
      return 'research_papers';
    case 'ai':
      return 'ai_content';
    default:
      console.warn(`Unknown content type: ${normalizedType}, defaulting to forum_posts`);
      return 'forum_posts';
  }
};

export const getContentStateKey = (id: string, type: string | ContentType | ContentItemType): string => {
  return `${normalizeContentType(type)}:${id}`;
};

export const getIdFromStateKey = (key: string): string => {
  const parts = key.split(':');
  return parts.length > 1 ? parts[1] : '';
};

export const getTypeFromStateKey = (key: string): string => {
  const parts = key.split(':');
  return parts.length > 1 ? parts[0] : '';
};
