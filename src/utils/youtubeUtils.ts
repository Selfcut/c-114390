
/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param url YouTube URL
 * @returns Video ID or null if invalid
 */
export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Convert a regular YouTube URL to an embed URL
 * @param url YouTube URL
 * @returns YouTube embed URL or null if invalid
 */
export const getYoutubeEmbedUrl = (url: string): string | null => {
  const videoId = extractYoutubeId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Validate if a string is a valid YouTube URL
 * @param url URL to check
 * @returns true if valid YouTube URL
 */
export const isValidYoutubeUrl = (url: string): boolean => {
  return !!extractYoutubeId(url);
};
