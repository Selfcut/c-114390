
import { ContentType } from './unified-content-types';

export interface ContentTypeInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  likesColumnName: string;
  bookmarksColumnName: string;
}

export function getContentTypeInfo(contentType: ContentType): ContentTypeInfo {
  switch (contentType) {
    case ContentType.Quote:
      return {
        contentTable: 'quotes',
        likesTable: 'quote_likes',
        bookmarksTable: 'quote_bookmarks',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Forum:
      return {
        contentTable: 'forum_posts',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        likesColumnName: 'upvotes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Knowledge:
      return {
        contentTable: 'knowledge_entries',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    case ContentType.Media:
      return {
        contentTable: 'media_posts',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        likesColumnName: 'likes',
        bookmarksColumnName: 'bookmarks'
      };
    default:
      return {
        contentTable: 'forum_posts',
        likesTable: 'content_likes',
        bookmarksTable: 'content_bookmarks',
        likesColumnName: 'upvotes',
        bookmarksColumnName: 'bookmarks'
      };
  }
}

export { ContentType };
