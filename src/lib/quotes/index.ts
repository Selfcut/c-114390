
// Re-export types
export * from './types';

// Export functions from quotes-service.ts
export {
  fetchQuotes,
  fetchQuotesWithFilters,
  fetchQuoteById,
  countQuotes,
  updateQuote,
  deleteQuote,
  createQuote
} from './quotes-service';

// Export functions from quote-interactions.ts
export {
  checkUserLikedQuote,
  checkUserBookmarkedQuote,
  likeQuote,
  bookmarkQuote,
  fetchComments,
  createComment,
  deleteComment,
  subscribeToQuoteUpdates,
  subscribeToQuoteInteractions
} from './quote-interactions';
