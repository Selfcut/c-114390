
import { checkQuoteInteractions, addQuoteLike, removeQuoteLike, addQuoteBookmark, removeQuoteBookmark } from './quote-interactions';
import { 
  checkGeneralContentInteractions, 
  addGeneralContentLike, 
  removeGeneralContentLike, 
  addGeneralContentBookmark, 
  removeGeneralContentBookmark 
} from './general-content-interactions';

/**
 * Check if a user has liked or bookmarked a piece of content
 */
export const checkContentInteractions = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<{ isLiked: boolean, isBookmarked: boolean }> => {
  const isQuote = contentType === 'quote';
  
  if (isQuote) {
    return await checkQuoteInteractions(userId, contentId);
  } else {
    return await checkGeneralContentInteractions(userId, contentId, contentType);
  }
};

/**
 * Add a like to content
 */
export const addContentLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  const isQuote = contentType === 'quote';
  
  if (isQuote) {
    return await addQuoteLike(userId, contentId);
  } else {
    return await addGeneralContentLike(userId, contentId, contentType);
  }
};

/**
 * Remove a like from content
 */
export const removeContentLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  const isQuote = contentType === 'quote';
  
  if (isQuote) {
    return await removeQuoteLike(userId, contentId);
  } else {
    return await removeGeneralContentLike(userId, contentId, contentType);
  }
};

/**
 * Add a bookmark to content
 */
export const addContentBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  const isQuote = contentType === 'quote';
  
  if (isQuote) {
    return await addQuoteBookmark(userId, contentId);
  } else {
    return await addGeneralContentBookmark(userId, contentId, contentType);
  }
};

/**
 * Remove a bookmark from content
 */
export const removeContentBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  const isQuote = contentType === 'quote';
  
  if (isQuote) {
    return await removeQuoteBookmark(userId, contentId);
  } else {
    return await removeGeneralContentBookmark(userId, contentId, contentType);
  }
};
