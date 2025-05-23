
import { useMemo } from 'react';
import { ContentType, isValidContentType } from '@/types/contentTypes';

export interface ContentTypeOptions {
  contentType: string;
}

interface TableNames {
  likesTable: string;
  contentTable: string;
  contentIdField: string;
  commentsTable: string;
}

/**
 * Hook for getting database table names for different content types
 * Uses consistent type handling with ContentType enum
 */
export const useContentTables = (options: ContentTypeOptions) => {
  const { contentType } = options;
  
  const tableNames = useMemo<TableNames>(() => {
    // Validate content type
    if (!contentType) {
      console.warn('Content type not provided, defaulting to forum');
      return {
        likesTable: 'content_likes',
        contentTable: 'forum_posts',
        contentIdField: 'content_id',
        commentsTable: 'content_comments'
      };
    }
    
    switch (contentType) {
      case ContentType.Media:
        return {
          likesTable: 'media_likes',
          contentTable: 'media_posts',
          contentIdField: 'post_id',
          commentsTable: 'media_comments'
        };
      case ContentType.Knowledge:
        return {
          likesTable: 'content_likes',
          contentTable: 'knowledge_entries',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      case ContentType.Quote:
        return {
          likesTable: 'quote_likes',
          contentTable: 'quotes',
          contentIdField: 'quote_id',
          commentsTable: 'quote_comments'
        };
      case ContentType.Wiki:
        return {
          likesTable: 'content_likes',
          contentTable: 'wiki_articles',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      case ContentType.Forum:
        return {
          likesTable: 'content_likes',
          contentTable: 'forum_posts',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      default:
        console.warn(`Unknown content type: ${contentType}, using generic tables`);
        return {
          likesTable: 'content_likes',
          contentTable: contentType,
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
    }
  }, [contentType]);
  
  const getTableNames = () => tableNames;
  
  return { getTableNames };
};
