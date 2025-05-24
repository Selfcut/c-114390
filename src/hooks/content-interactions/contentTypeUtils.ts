
import { ContentType } from '@/types/unified-content-types';

export const normalizeContentType = (type: string): string => {
  const normalized = type.toLowerCase().trim();
  
  switch (normalized) {
    case 'quote':
    case 'quotes':
      return 'quote';
    case 'forum':
    case 'forum_post':
    case 'forum_posts':
      return 'forum';
    case 'media':
    case 'media_post':
    case 'media_posts':
      return 'media';
    case 'wiki':
    case 'wiki_article':
    case 'wiki_articles':
      return 'wiki';
    case 'knowledge':
    case 'knowledge_entry':
    case 'knowledge_entries':
      return 'knowledge';
    case 'research':
    case 'research_paper':
    case 'research_papers':
      return 'research';
    case 'ai':
      return 'ai';
    default:
      return 'forum';
  }
};

export const getContentKey = (contentId: string, contentType: string): string => {
  const normalized = normalizeContentType(contentType);
  return `${contentId}_${normalized}`;
};

export const stringToContentType = (type: string): ContentType => {
  const normalized = normalizeContentType(type);
  
  switch (normalized) {
    case 'quote':
      return ContentType.Quote;
    case 'media':
      return ContentType.Media;
    case 'knowledge':
      return ContentType.Knowledge;
    case 'wiki':
      return ContentType.Wiki;
    case 'forum':
      return ContentType.Forum;
    case 'research':
      return ContentType.Research;
    case 'ai':
      return ContentType.AI;
    default:
      return ContentType.Forum;
  }
};
