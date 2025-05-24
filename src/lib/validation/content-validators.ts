
import { z } from 'zod';

// Base validation schemas
export const baseContentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .max(10000, 'Content must be less than 10,000 characters')
    .optional(),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
});

// Quote validation
export const quoteSchema = baseContentSchema.extend({
  text: z.string()
    .min(1, 'Quote text is required')
    .max(1000, 'Quote must be less than 1000 characters'),
  author: z.string()
    .min(1, 'Author is required')
    .max(100, 'Author name must be less than 100 characters'),
  source: z.string()
    .max(200, 'Source must be less than 200 characters')
    .optional(),
  category: z.string()
    .min(1, 'Category is required'),
});

// Forum post validation
export const forumPostSchema = baseContentSchema.extend({
  content: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10,000 characters'),
});

// Media post validation
export const mediaPostSchema = baseContentSchema.extend({
  type: z.enum(['image', 'video', 'youtube', 'document', 'text']),
  url: z.string()
    .url('Must be a valid URL')
    .optional()
    .refine((url, ctx) => {
      const type = ctx.parent.type;
      if (type !== 'text' && !url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'URL is required for non-text posts'
        });
        return false;
      }
      return true;
    }),
});

// Wiki article validation
export const wikiArticleSchema = baseContentSchema.extend({
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  category: z.string()
    .min(1, 'Category is required'),
  content: z.string()
    .min(1, 'Content is required'),
});

// Comment validation
export const commentSchema = z.object({
  comment: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
  content_id: z.string().uuid('Invalid content ID'),
  content_type: z.string().min(1, 'Content type is required'),
});

// User profile validation
export const userProfileSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

// Validation helper functions
export const validateContent = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validateAndSanitize = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown,
  sanitizeFields: string[] = []
): {
  success: boolean;
  data?: T;
  errors?: string[];
} => {
  const validation = validateContent(schema, data);
  
  if (validation.success && validation.data) {
    // Sanitize specified fields
    const sanitizedData = { ...validation.data } as any;
    sanitizeFields.forEach(field => {
      if (sanitizedData[field] && typeof sanitizedData[field] === 'string') {
        sanitizedData[field] = sanitizeHtml(sanitizedData[field]);
      }
    });
    
    return { success: true, data: sanitizedData };
  }
  
  return validation;
};
