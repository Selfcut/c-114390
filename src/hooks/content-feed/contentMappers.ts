
import { ContentFeedItem } from '@/hooks/useContentFeed';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Map a knowledge entry from database to ContentFeedItem format
 */
export function mapKnowledgeToFeedItem(knowledgeEntry: any): ContentFeedItem {
  return {
    id: knowledgeEntry.id,
    type: ContentItemType.Knowledge,
    title: knowledgeEntry.title,
    summary: knowledgeEntry.summary,
    content: knowledgeEntry.content,
    author: {
      name: knowledgeEntry.profiles?.name || 'Unknown',
      avatar: knowledgeEntry.profiles?.avatar_url,
      username: knowledgeEntry.profiles?.username
    },
    createdAt: knowledgeEntry.created_at,
    tags: knowledgeEntry.categories || [],
    coverImage: knowledgeEntry.cover_image,
    metrics: {
      likes: knowledgeEntry.likes || 0,
      comments: knowledgeEntry.comments || 0,
      views: knowledgeEntry.views || 0
    }
  };
}

/**
 * Map a quote from database to ContentFeedItem format
 */
export function mapQuoteToFeedItem(quote: any): ContentFeedItem {
  return {
    id: quote.id,
    type: ContentItemType.Quote,
    title: quote.author ? `Quote from ${quote.author}` : 'Quote',
    content: quote.text,
    author: {
      name: quote.profiles?.name || 'Unknown',
      avatar: quote.profiles?.avatar_url,
      username: quote.profiles?.username
    },
    createdAt: quote.created_at,
    tags: quote.tags || [],
    metrics: {
      likes: quote.likes || 0,
      comments: quote.comments || 0,
      bookmarks: quote.bookmarks || 0
    }
  };
}

/**
 * Map a media post from database to ContentFeedItem format
 */
export function mapMediaToFeedItem(media: any): ContentFeedItem {
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
    type: ContentItemType.Media,
    title: media.title,
    summary: media.content,
    author: {
      name: media.profiles?.name || 'Unknown',
      avatar: media.profiles?.avatar_url,
      username: media.profiles?.username
    },
    createdAt: media.created_at,
    tags: media.tags || [],
    mediaUrl: media.url,
    mediaType: mediaType,
    metrics: {
      likes: media.likes || 0,
      comments: media.comments || 0,
      views: media.views || 0
    }
  };
}

/**
 * Map an AI generated content from database to ContentFeedItem format
 */
export function mapAIContentToFeedItem(aiContent: any): ContentFeedItem {
  return {
    id: aiContent.id,
    type: ContentItemType.AI,
    title: aiContent.title,
    summary: aiContent.summary,
    content: aiContent.content,
    author: {
      name: 'AI Assistant',
      avatar: '/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png'
    },
    createdAt: aiContent.created_at,
    tags: aiContent.tags || [],
    metrics: {
      likes: aiContent.likes || 0,
      comments: aiContent.comments || 0,
      views: aiContent.views || 0
    }
  };
}
