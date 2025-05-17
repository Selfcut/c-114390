
// Type definitions for different payload types
export interface MediaLikePayload {
  user_id: string;
  post_id: string;
}

export interface ContentLikePayload {
  user_id: string;
  content_id: string;
  content_type: string;
}

export interface QuoteLikePayload {
  user_id: string;
  quote_id: string;
}

export interface MediaCommentPayload {
  user_id: string;
  post_id: string;
  content: string;
}

export interface ContentCommentPayload {
  user_id: string;
  content_id: string;
  content_type: string;
  comment: string;
  content: string;
}

export interface QuoteCommentPayload {
  user_id: string;
  quote_id: string;
  content: string;
}

export interface InteractionOptions {
  contentType: 'media' | 'forum' | 'wiki' | 'quote';
  onSuccess?: () => void;
  onError?: (error: any) => void;
}
