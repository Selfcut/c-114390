
import { ContentType } from '@/types/unified-content-types';

export const normalizeContentType = (contentType: string | ContentType): string => {
  if (typeof contentType === 'string') {
    return contentType.toLowerCase();
  }
  return contentType.toLowerCase();
};

export const getContentTypeFromString = (type: string): ContentType => {
  const normalized = normalizeContentType(type);
  
  switch (normalized) {
    case 'quote':
      return ContentType.Quote;
    case 'forum':
      return ContentType.Forum;
    case 'media':
      return ContentType.Media;
    case 'knowledge':
      return ContentType.Knowledge;
    case 'wiki':
      return ContentType.Wiki;
    case 'research':
      return ContentType.Research;
    case 'ai':
      return ContentType.AI;
    default:
      return ContentType.All;
  }
};
