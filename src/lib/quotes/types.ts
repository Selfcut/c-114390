
// Define the interfaces for quotes
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string | null;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  created_at: string;
  updated_at?: string;
  featured_date?: string | null;
  user_id: string;
}

// Extended quote with user info
export interface QuoteWithUser extends Quote {
  user: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  };
}

// Type for submitting a new quote
export interface QuoteSubmission {
  text: string;
  author: string;
  source?: string;
  category: string;
  tags?: string[];
}

// Filter options for quotes
export interface QuoteFilterOptions {
  searchQuery?: string;
  filterTag?: string | null;
  sortOption?: QuoteSortOption;
  // For quotes-service.ts compatibility
  searchTerm?: string;
  tag?: string;
  sortColumn?: string;
  sortAscending?: boolean;
  limit?: number;
  offset?: number;
}

// Sort options for quotes
export type QuoteSortOption = 'newest' | 'oldest' | 'most_liked' | 'most_bookmarked' | 'popular';

// Interface for quote comments
export interface QuoteComment {
  id: string;
  content: string;
  quote_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

// Props for Edit Quote Modal
export interface EditQuoteModalProps {
  quote: QuoteWithUser;
  isOpen: boolean;
  onClose: () => void;
  onQuoteUpdated: (quote: QuoteWithUser) => void;
}

// Props for Delete Quote Dialog
export interface DeleteQuoteDialogProps {
  quoteId: string;
  isOpen: boolean;
  onClose: () => void;
  onQuoteDeleted: () => void;
}
