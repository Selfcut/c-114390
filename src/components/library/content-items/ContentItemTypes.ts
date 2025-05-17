
import { Author } from "@/types/content";

export type ContentItemType = 'knowledge' | 'media' | 'quote' | 'ai';

export interface ContentItemMetrics {
  likes?: number;
  views?: number;
  comments?: number;
  bookmarks?: number;
}

export interface ContentItemProps {
  id: string;
  type: ContentItemType;
  title: string;
  content?: string;
  summary?: string;
  author: Author | string;
  createdAt: string | Date;
  metrics?: ContentItemMetrics;
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  viewMode?: 'grid' | 'list' | 'feed';
  onLike?: (id: string, type: ContentItemType) => void;
  onBookmark?: (id: string, type: ContentItemType) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}
