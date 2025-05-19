
export interface QuoteWithUser {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  user_id: string;
  user?: {
    id: string | null;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

export type QuoteSubmission = {
  text: string;
  author: string;
  source?: string;
  category?: string;
  tags?: string[];
};

export type QuoteFilterOptions = {
  searchTerm?: string;
  tag?: string;
  limit?: number;
  offset?: number;
};
