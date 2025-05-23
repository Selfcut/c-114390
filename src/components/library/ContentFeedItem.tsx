
import React from 'react';
import { UnifiedContentItem } from './UnifiedContentItem';
import { ContentItemProps, ContentItemType, ContentViewMode, MediaType } from './content-items/ContentItemTypes';

// Define the type for our feed items
export interface ContentFeedItem {
  id: string;
  type: ContentItemType;
  title: string;
  summary?: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: string;
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    bookmarks?: number;
  };
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

interface ContentFeedItemComponentProps {
  item: ContentFeedItem;
  userLikes?: Record<string, boolean>;
  userBookmarks?: Record<string, boolean>;
  onLike?: (id: string, type: ContentItemType) => void;
  onBookmark?: (id: string, type: ContentItemType) => void;
  onClick?: (id: string, type: ContentItemType) => void;
  viewMode: ContentViewMode;
}

export const ContentFeedItemComponent: React.FC<ContentFeedItemComponentProps> = ({
  item,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onClick,
  viewMode
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item.id, item.type);
    }
  };
  
  const handleLike = () => {
    if (onLike) {
      onLike(item.id, item.type);
    }
  };
  
  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(item.id, item.type);
    }
  };

  // Get the user interaction state
  const stateKey = `${item.type}:${item.id}`;
  const isLiked = userLikes?.[stateKey] || false;
  const isBookmarked = userBookmarks?.[stateKey] || false;

  // Format data for the ContentItem props
  const contentProps: ContentItemProps = {
    id: item.id,
    type: item.type,
    title: item.title,
    summary: item.summary,
    content: item.content,
    author: {
      name: item.author?.name || 'Unknown',
      avatar: item.author?.avatar,
      username: item.author?.username
    },
    createdAt: item.createdAt,
    metrics: item.metrics,
    tags: item.tags || [],
    coverImage: item.coverImage,
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType,
    isLiked: isLiked,
    isBookmarked: isBookmarked,
    viewMode,
    onLike: handleLike,
    onBookmark: handleBookmark,
    onClick: handleClick
  };

  return <UnifiedContentItem {...contentProps} />;
};
