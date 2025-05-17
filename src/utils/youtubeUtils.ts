
/**
 * Validates if a URL is a valid YouTube URL
 */
export const isValidYoutubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  // YouTube URL patterns to match
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(\S*)?$/,  // Standard watch URLs
    /^(https?:\/\/)?(www\.)?(youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/,               // Short youtu.be URLs
    /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/      // Embed URLs
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

/**
 * Extracts the YouTube video ID from a valid YouTube URL
 */
export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Extract from standard watch URL
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  
  return match ? match[1] : null;
};
