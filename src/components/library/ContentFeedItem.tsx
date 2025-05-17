
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
  // Normalize the author object to ensure avatar is consistently available
  const normalizedItem = {
    ...item,
    author: {
      ...item.author,
      // ContentItemAuthor only has 'avatar' field, not 'avatar_url'
      // Make sure we use the avatar field consistently
      avatar: item.author.avatar || ((item.author as any).avatar_url)
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
