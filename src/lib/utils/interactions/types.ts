
export interface ContentInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export interface InteractionResult {
  success: boolean;
  newState: boolean;
}

// Database insert types for likes
export interface ContentLikeInsert {
  user_id: string;
  content_id: string;
  content_type: string;
}

export interface QuoteLikeInsert {
  user_id: string;
  quote_id: string;
}

export interface MediaLikeInsert {
  user_id: string;
  post_id: string;
}

// Database insert types for bookmarks
export interface ContentBookmarkInsert {
  user_id: string;
  content_id: string;
  content_type: string;
}

export interface QuoteBookmarkInsert {
  user_id: string;
  quote_id: string;
}
