
// Re-export types
export * from './types';

// Export functions from quotes-service.ts
export {
  fetchQuotes,
  fetchQuotesWithFilters,
  fetchQuoteById,
  countQuotes,
  // Rename this to avoid collision with the same function in quote-interactions.ts
  createQuote as createQuoteSubmission
} from './quotes-service';

// Export functions from quote-interactions.ts
export {
  // Note: We're explicitly excluding createQuote here to avoid the conflict
  // and will only use the one from quotes-service.ts (renamed above)
  checkUserLikedQuote,
  checkUserBookmarkedQuote,
  likeQuote,
  bookmarkQuote
} from './quote-interactions';
