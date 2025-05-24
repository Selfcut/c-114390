
export const validateMediaFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  const isValidType = [
    ...allowedImageTypes,
    ...allowedVideoTypes,
    ...allowedDocumentTypes
  ].includes(file.type);

  if (!isValidType) {
    return { isValid: false, error: 'File type not supported' };
  }

  return { isValid: true };
};

export const validateYouTubeUrl = (url: string): { isValid: boolean; error?: string } => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&[\w=]*)?$/;
  
  if (!youtubeRegex.test(url)) {
    return { isValid: false, error: 'Please enter a valid YouTube URL' };
  }

  return { isValid: true };
};

export const sanitizeContent = (content: string): string => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validatePostData = (data: {
  title: string;
  content?: string;
  type: string;
  url?: string;
  file?: File;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.content && data.content.length > 5000) {
    errors.push('Content must be less than 5000 characters');
  }

  if (data.type === 'youtube' && data.url) {
    const urlValidation = validateYouTubeUrl(data.url);
    if (!urlValidation.isValid) {
      errors.push(urlValidation.error || 'Invalid YouTube URL');
    }
  }

  if (data.file) {
    const fileValidation = validateMediaFile(data.file);
    if (!fileValidation.isValid) {
      errors.push(fileValidation.error || 'Invalid file');
    }
  }

  return { isValid: errors.length === 0, errors };
};
