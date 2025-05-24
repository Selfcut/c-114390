
import { z } from 'zod';

// User schemas
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  bio: z.string().max(500, 'Bio too long').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  avatar_url: z.string().url('Invalid avatar URL').optional()
});

// Forum schemas
export const forumPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').optional()
});

export const commentSchema = z.object({
  comment: z.string().min(1, 'Comment is required').max(2000, 'Comment too long')
});

// Media schemas
export const mediaPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().max(2000, 'Content too long').optional(),
  type: z.enum(['image', 'video', 'audio', 'document']),
  url: z.string().url('Invalid URL').optional()
});

// Quote schemas
export const quoteSchema = z.object({
  text: z.string().min(1, 'Quote text is required').max(1000, 'Quote too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  source: z.string().max(200, 'Source too long').optional(),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').optional()
});

// Knowledge schemas
export const knowledgeEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary too long'),
  content: z.string().max(20000, 'Content too long').optional(),
  categories: z.array(z.string().max(50, 'Category too long')).max(10, 'Too many categories').optional(),
  cover_image: z.string().url('Invalid image URL').optional()
});

// Research schemas
export const researchPaperSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(200, 'Author name too long'),
  summary: z.string().min(1, 'Summary is required').max(1000, 'Summary too long'),
  content: z.string().max(50000, 'Content too long').optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  source: z.string().max(200, 'Source too long').optional(),
  source_url: z.string().url('Invalid URL').optional(),
  published_date: z.string().datetime('Invalid date').optional()
});

// Wiki schemas
export const wikiArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  content: z.string().max(50000, 'Content too long').optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  tags: z.array(z.string().max(50, 'Tag too long')).max(15, 'Too many tags').optional(),
  image_url: z.string().url('Invalid image URL').optional()
});

// Event schemas
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  date: z.string().datetime('Invalid date'),
  end_date: z.string().datetime('Invalid end date').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  max_attendees: z.number().int().min(1, 'Must allow at least 1 attendee').optional(),
  image_url: z.string().url('Invalid image URL').optional()
});

// Validation helpers
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};
