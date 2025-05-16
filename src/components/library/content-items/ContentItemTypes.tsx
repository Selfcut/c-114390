import { ReactNode } from 'react';

export type ContentItemType = 'knowledge' | 'media' | 'quote' | 'ai' | 'wiki';

export interface ContentItemAuthor {
  name: string;
  avatar?: string;
  username?: string;
}

export interface ContentItemMetrics {
  likes?: number;
  comments?: number;
  views?: number;
  bookmarks?: number;
}

export interface ContentItemProps {
  id: string;
  type: ContentItemType;
  title: string;
  content?: string;
  summary?: string;
  author: ContentItemAuthor;
  createdAt: Date | string;
  metrics?: ContentItemMetrics;
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | 'youtube' | 'text';
  viewMode: 'grid' | 'list' | 'feed';
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}

// Helper to format date consistently
export const formatDate = (createdAt: Date | string): string => {
  return typeof createdAt === 'string' 
    ? new Date(createdAt).toLocaleDateString() 
    : createdAt.toLocaleDateString();
};

// Content type icon mapper function
export const getTypeIcon = (type: ContentItemType) => {
  switch(type) {
    case 'knowledge': return { icon: 'BookOpen', color: 'text-blue-500' };
    case 'media': return { icon: 'Image', color: 'text-green-500' };
    case 'quote': return { icon: 'Quote', color: 'text-purple-500' };
    case 'ai': return { icon: 'Brain', color: 'text-amber-500' };
    case 'wiki': return { icon: 'BookOpen', color: 'text-indigo-500' };
    default: return { icon: 'BookOpen', color: 'text-blue-500' };
  }
};
