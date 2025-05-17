
import { useCallback } from 'react';

export interface TableNames {
  likesTable: 'media_likes' | 'content_likes' | 'quote_likes';
  commentsTable: 'media_comments' | 'content_comments' | 'quote_comments';
  contentTable: 'media_posts' | 'forum_posts' | 'wiki_articles' | 'quotes';
  contentIdField: 'post_id' | 'content_id' | 'quote_id';
}

export interface ContentTypeOptions {
  contentType: 'media' | 'forum' | 'wiki' | 'quote';
}

export const useContentTables = ({ contentType }: ContentTypeOptions) => {
  // Helper to get the right table names based on content type
  const getTableNames = useCallback((): TableNames => {
    switch (contentType) {
      case 'media':
        return {
          likesTable: 'media_likes',
          commentsTable: 'media_comments',
          contentTable: 'media_posts',
          contentIdField: 'post_id',
        };
      case 'forum':
        return {
          likesTable: 'content_likes',
          commentsTable: 'content_comments',
          contentTable: 'forum_posts',
          contentIdField: 'content_id',
        };
      case 'wiki':
        return {
          likesTable: 'content_likes',
          commentsTable: 'content_comments',
          contentTable: 'wiki_articles',
          contentIdField: 'content_id',
        };
      case 'quote':
        return {
          likesTable: 'quote_likes',
          commentsTable: 'quote_comments',
          contentTable: 'quotes',
          contentIdField: 'quote_id',
        };
      default:
        return {
          likesTable: 'content_likes',
          commentsTable: 'content_comments',
          contentTable: 'forum_posts',
          contentIdField: 'content_id',
        };
    }
  }, [contentType]);

  return { getTableNames };
};
