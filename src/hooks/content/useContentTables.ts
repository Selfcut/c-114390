
import { useMemo } from 'react';
import { ContentType } from '@/types/unified-content-types';
import { normalizeContentType } from '@/hooks/content-interactions/contentTypeUtils';

export interface ContentTypeOptions {
  contentType: string | ContentType;
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
  const contentTypeStr = normalizeContentType(options.contentType);
  
  const tableNames = useMemo<TableNames>(() => {
    // Validate content type
    if (!contentTypeStr) {
      console.warn('Content type not provided, defaulting to forum');
      return {
        likesTable: 'content_likes',
        contentTable: 'forum_posts',
        contentIdField: 'content_id',
        commentsTable: 'content_comments'
      };
    }
    
    switch (contentTypeStr) {
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
      case 'forum':
        return {
          likesTable: 'content_likes',
          contentTable: 'forum_posts',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      case 'research':
        return {
          likesTable: 'content_likes',
          contentTable: 'research_papers',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      case 'ai':
        return {
          likesTable: 'content_likes',
          contentTable: 'ai_content',
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
      default:
        console.warn(`Unknown content type: ${contentTypeStr}, using generic tables`);
        return {
          likesTable: 'content_likes',
          contentTable: contentTypeStr,
          contentIdField: 'content_id',
          commentsTable: 'content_comments'
        };
    }
  }, [contentTypeStr]);
  
  const getTableNames = () => tableNames;
  
  return { getTableNames };
};
