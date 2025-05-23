
import React from 'react';
import { cn } from '@/lib/utils';
import { ContentItemGrid } from './content-items/ContentItemGrid';
import { ContentItemList } from './content-items/ContentItemList';
import { ContentItemFeed } from './content-items/ContentItemFeed';
import { ContentItemProps } from './content-items/ContentItemTypes';

export type { ContentItemType, ContentItemProps } from './content-items/ContentItemTypes';

export const UnifiedContentItem: React.FC<ContentItemProps> = (props) => {
  const { viewMode } = props;

  // Render the appropriate view component based on the viewMode
  switch (viewMode) {
    case 'grid':
      return <ContentItemGrid {...props} />;
    case 'list':
      return <ContentItemList {...props} />;
    case 'feed':
      return <ContentItemFeed {...props} />;
    default:
      return <ContentItemList {...props} />;
  }
};
