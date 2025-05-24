
import { ContentType } from '@/types/unified-content-types';

export { ContentType };

export interface ContentTypeInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  contentIdField: string;
  likesColumnName: string;
  bookmarksColumnName: string;
}

export const getContentTableName = (contentType: ContentType | string): string => {
  const normalizedType = typeof contentType === 'string' ? contentType.toLowerCase() : contentType;
  
  switch (normalizedType) {
    case ContentType.Quote:
    case 'quote':
      return 'quotes';
    case ContentType.Forum:
    case 'forum':
      return 'forum_posts';
    case ContentType.Media:
    case 'media':
      return 'media_posts';
    case ContentType.Knowledge:
    case 'knowledge':
      return 'knowledge_entries';
    case ContentType.Wiki:
    case 'wiki':
      return 'wiki_articles';
    case ContentType.Research:
    case 'research':
      return 'research_papers';
    case ContentType.AI:
    case 'ai':
      return 'ai_content';
    default:
      return 'forum_posts';
  }
};

export const getContentTypeInfo = (contentType: ContentType | string): ContentTypeInfo => {
  const normalizedType = typeof contentType === 'string' ? contentType.toLowerCase() : contentType;
  
  switch (normalizedType) {
    case ContentType.Quote:
    case 'quote':
      return {
        contentTable: 'quotes',
        likesTable: 'quote_likes',
        bookmarksTable: 'quote_bookmarks',
        contentIdField: 'quote_id',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Forum:
    case 'forum':
      return {
        contentTable: 'forum_posts',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        contentIdField: 'content_id',
        likesColumnName: 'upvotes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Media:
    case 'media':
      return {
        contentTable: 'media_posts',
        likesTable: 'media_likes',
        bookmarksTable: 'content_bookmarks',
        contentIdField: 'post_id',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Knowledge:
    case 'knowledge':
      return {
        contentTable: 'knowledge_entries',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        contentIdField: 'content_id',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Wiki:
    case 'wiki':
      return {
        contentTable: 'wiki_articles',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        contentIdField: 'content_id',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    default:
      return {
        contentTable: 'forum_posts',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        contentIdField: 'content_id',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
  }
};
