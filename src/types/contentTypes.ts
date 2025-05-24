
import { ContentType } from './unified-content-types';

export interface ContentTypeInfo {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  likesColumnName: string;
  bookmarksColumnName: string;
}

export function isValidContentType(contentType: string): boolean {
  return Object.values(ContentType).includes(contentType as ContentType);
}

export function getContentTableName(contentType: ContentType): string {
  switch (contentType) {
    case ContentType.Quote:
      return 'quotes';
    case ContentType.Forum:
      return 'forum_posts';
    case ContentType.Knowledge:
      return 'knowledge_entries';
    case ContentType.Media:
      return 'media_posts';
    case ContentType.Wiki:
      return 'wiki_articles';
    case ContentType.Research:
      return 'research_papers';
    case ContentType.AI:
      return 'ai_content';
    default:
      return 'forum_posts';
  }
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
