
import React from 'react';
import { UnifiedContentItem, type ContentItemProps, type ContentItemType } from './UnifiedContentItem';

interface ContentFeedItemProps {
  item: ContentItemProps;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  onLike: (id: string, itemType: ContentItemType) => void;
  onBookmark: (id: string, itemType: ContentItemType) => void;
  onClick: (id: string, itemType: ContentItemType) => void;
}

export const ContentFeedItem: React.FC<ContentFeedItemProps> = ({
  item,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onClick
}) => {
  // If avatar field exists in author but avatar_url doesn't, map it correctly
  const normalizedItem = {
    ...item,
    author: {
      ...item.author,
      // Ensure both avatar and avatar_url are populated if either exists
      avatar: item.author.avatar || item.author.avatar_url,
      avatar_url: item.author.avatar_url || item.author.avatar
    }
  };

  return (
    <UnifiedContentItem
      key={item.id}
      {...normalizedItem}
      isLiked={!!userLikes[item.id]}
      isBookmarked={!!userBookmarks[item.id]}
      onLike={(id) => onLike(id, item.type)}
      onBookmark={(id) => onBookmark(id, item.type)}
      onClick={(id) => onClick(id, item.type)}
    />
  );
};
