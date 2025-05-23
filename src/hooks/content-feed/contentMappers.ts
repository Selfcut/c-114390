
import { UnifiedContentItem, ContentType } from '@/types/unified-content-types';
import { ContentViewMode } from '@/types/unified-content-types';

/**
 * Map a knowledge entry from database to UnifiedContentItem format
 */
export function mapKnowledgeToFeedItem(knowledgeEntry: any, viewMode: ContentViewMode): UnifiedContentItem {
  return {
    id: knowledgeEntry.id,
    type: ContentType.Knowledge,
    title: knowledgeEntry.title,
    summary: knowledgeEntry.summary,
    content: knowledgeEntry.content,
    author: {
      id: knowledgeEntry.profiles?.id || knowledgeEntry.user_id || 'unknown',
      name: knowledgeEntry.profiles?.name || 'Unknown',
      avatar: knowledgeEntry.profiles?.avatar_url,
      username: knowledgeEntry.profiles?.username
    },
    createdAt: new Date(knowledgeEntry.created_at),
    tags: knowledgeEntry.categories || [],
    coverImage: knowledgeEntry.cover_image,
    viewMode,
    metrics: {
      likes: knowledgeEntry.likes || 0,
      comments: knowledgeEntry.comments || 0,
      views: knowledgeEntry.views || 0
    }
  };
}

/**
 * Map a quote from database to UnifiedContentItem format
 */
export function mapQuoteToFeedItem(quote: any, viewMode: ContentViewMode): UnifiedContentItem {
  return {
    id: quote.id,
    type: ContentType.Quote,
    title: quote.author ? `Quote from ${quote.author}` : 'Quote',
    content: quote.text,
    author: {
      id: quote.profiles?.id || quote.user_id || 'unknown',
      name: quote.profiles?.name || 'Unknown',
      avatar: quote.profiles?.avatar_url,
      username: quote.profiles?.username
    },
    createdAt: new Date(quote.created_at),
    tags: quote.tags || [],
    viewMode,
    metrics: {
      likes: quote.likes || 0,
      comments: quote.comments || 0,
      views: 0,
      bookmarks: quote.bookmarks || 0
    }
  };
}

/**
 * Map a media post from database to UnifiedContentItem format
 */
export function mapMediaToFeedItem(media: any, viewMode: ContentViewMode): UnifiedContentItem {
  let mediaType: 'image' | 'video' | 'youtube' | 'document' | 'text' = 'image';
  
  if (media.type) {
    switch (media.type.toLowerCase()) {
      case 'video':
        mediaType = 'video';
        break;
      case 'youtube':
        mediaType = 'youtube';
        break;
      case 'document':
        mediaType = 'document';
        break;
      case 'text':
        mediaType = 'text';
        break;
      default:
        mediaType = 'image';
    }
  }
  
  return {
    id: media.id,
    type: ContentType.Media,
    title: media.title,
    summary: media.content,
    author: {
      id: media.profiles?.id || media.user_id || 'unknown',
      name: media.profiles?.name || 'Unknown',
      avatar: media.profiles?.avatar_url,
      username: media.profiles?.username
    },
    createdAt: new Date(media.created_at),
    tags: media.tags || [],
    mediaUrl: media.url,
    mediaType: mediaType,
    viewMode,
    metrics: {
      likes: media.likes || 0,
      comments: media.comments || 0,
      views: media.views || 0
    }
  };
}

/**
 * Map an AI generated content from database to UnifiedContentItem format
 */
export function mapAIContentToFeedItem(aiContent: any, viewMode: ContentViewMode): UnifiedContentItem {
  return {
    id: aiContent.id,
    type: ContentType.AI,
    title: aiContent.title,
    summary: aiContent.summary,
    content: aiContent.content,
    author: {
      id: 'ai-assistant',
      name: 'AI Assistant',
      avatar: '/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png',
      username: 'ai-assistant'
    },
    createdAt: new Date(aiContent.created_at),
    tags: aiContent.tags || [],
    viewMode,
    metrics: {
      likes: aiContent.likes || 0,
      comments: aiContent.comments || 0,
      views: aiContent.views || 0
    }
  };
}
