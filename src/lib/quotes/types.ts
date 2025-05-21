
// Define the base QuoteSubmission type
export interface QuoteSubmission {
  text: string;
  author: string;
  source?: string;
  category: string;
  tags?: string[];
}

// Define the full Quote type that extends QuoteSubmission with server-generated fields
export interface Quote extends QuoteSubmission {
  id: string;
  user_id: string;
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  updated_at?: string;
  featured_date?: string;
}

// Define the filter types for fetching quotes
export type QuoteSortOption = 'newest' | 'oldest' | 'popular' | 'featured' | 'most_liked' | 'most_bookmarked';

export interface QuotesFilter {
  page?: number;
  pageSize?: number;
  sortBy?: QuoteSortOption;
  tag?: string;
  search?: string;
  authorId?: string;
  category?: string;
}

// Ensure tags is required in QuoteWithUser
export interface QuoteWithUser extends Quote {
  user?: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  } | null;
  tags: string[]; // Make tags required to match consuming components
}

export interface QuoteComment {
  id: string;
  quote_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

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

export interface EditQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteWithUser;
  onQuoteUpdated: (updatedQuote: QuoteWithUser) => void;
}

export interface DeleteQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId: string;
  onQuoteDeleted: () => void;
}
