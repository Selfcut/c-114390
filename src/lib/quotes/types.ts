
export interface QuoteWithUser {
  id: string;
  text: string;
  author: string;
  source?: string | null;
  tags?: string[];
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  user_id: string;
  category?: string;
  featured_date?: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

export interface QuoteComment {
  id: string;
  quote_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
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
  sortColumn?: string;
  sortAscending?: boolean;
};

export interface PaginationResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
