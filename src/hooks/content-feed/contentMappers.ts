
import { ContentFeedItem } from './types';
import { ContentItemType, MediaType } from '@/components/library/content-items/ContentItemTypes';

export const mapKnowledgeToFeedItem = (item: any): ContentFeedItem => ({
  id: item.id,
  type: ContentItemType.Knowledge,
  title: item.title,
  summary: item.summary,
  content: item.content,
  author: {
    name: item.profiles?.name || 'Unknown Author',
    avatar: item.profiles?.avatar_url,
    username: item.profiles?.username
  },
  createdAt: item.created_at,
  metrics: {
    likes: item.likes || 0,
    comments: item.comments || 0,
    views: item.views || 0
  },
  tags: item.categories || [],
  coverImage: item.cover_image
});

export const mapQuoteToFeedItem = (item: any): ContentFeedItem => ({
  id: item.id,
  type: ContentItemType.Quote,
  title: item.author, // For quotes, we use the quote author as the title
  summary: item.text,
  author: {
    name: item.profiles?.name || 'Unknown Author',
    avatar: item.profiles?.avatar_url,
    username: item.profiles?.username
  },
  createdAt: item.created_at,
  metrics: {
    likes: item.likes || 0,
    comments: item.comments || 0,
    bookmarks: item.bookmarks || 0
  },
  tags: item.tags || [],
  coverImage: null
});

export const mapMediaToFeedItem = (item: any): ContentFeedItem => ({
  id: item.id,
  type: ContentItemType.Media,
  title: item.title,
  summary: item.content,
  author: {
    name: item.profiles?.name || 'Unknown Author',
    avatar: item.profiles?.avatar_url,
    username: item.profiles?.username
  },
  createdAt: item.created_at,
  metrics: {
    likes: item.likes || 0,
    comments: item.comments || 0,
    views: item.views || 0
  },
  tags: item.tags || [],
  mediaUrl: item.url,
  mediaType: item.type as MediaType
});
