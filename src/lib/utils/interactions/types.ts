
export interface ContentInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export type InteractionType = 'like' | 'bookmark';

export interface ContentLikeInsert {
  content_id: string;
  user_id: string;
  content_type: string;
}

export interface QuoteLikeInsert {
  quote_id: string;
  user_id: string;
}

export interface ContentBookmarkInsert {
  content_id: string;
  user_id: string;
  content_type: string;
}

export interface QuoteBookmarkInsert {
  quote_id: string;
  user_id: string;
}
