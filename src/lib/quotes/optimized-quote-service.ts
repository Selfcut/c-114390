
// This file now re-exports from the modular quote service files
import { QuoteWithUser, QuoteFilterOptions, QuoteSubmission } from './types';

// Export functions from quote-fetchers.ts
export { 
  fetchQuotesOptimized,
  fetchQuoteByIdOptimized
} from './quote-fetchers';

// Export functions from quote-mutations.ts
export { 
  createQuoteOptimized,
  updateQuoteOptimized,
  deleteQuoteOptimized
} from './quote-mutations';

// Export functions from quote-interactions.ts
export { 
  toggleQuoteLike,
  toggleQuoteBookmark,
  checkQuoteLike,
  checkQuoteBookmark
} from './quote-interactions';

// Re-export types for convenience
export type { QuoteWithUser, QuoteFilterOptions, QuoteSubmission };
