
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
      // Ensure the avatar field is populated by using any available avatar source
      // The ContentItemAuthor type only has 'avatar', not 'avatar_url'
      avatar: item.author.avatar || (item.author as any).avatar_url
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
