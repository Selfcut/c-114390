
import { useMemo } from 'react';

export interface ContentTypeOptions {
  contentType: string;
}

interface TableNames {
  likesTable: string;
  contentTable: string;
  contentIdField: string;
  commentsTable: string;  // Add this property
}

export const useContentTables = (options: ContentTypeOptions) => {
  const { contentType } = options;
  
  const tableNames = useMemo<TableNames>(() => {
    switch (contentType) {
      case 'media':
        return {
          likesTable: 'media_likes',
          contentTable: 'media_posts',
          contentIdField: 'post_id',
          commentsTable: 'media_comments'
        };
      case 'knowledge':
        return {
          likesTable: 'content_likes',
          contentTable: 'knowledge_entries',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      case 'quote':
        return {
          likesTable: 'quote_likes',
          contentTable: 'quotes',
          contentIdField: 'quote_id',
          commentsTable: 'quote_comments'
        };
      case 'wiki':
        return {
          likesTable: 'content_likes',
          contentTable: 'wiki_articles',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      default:
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
