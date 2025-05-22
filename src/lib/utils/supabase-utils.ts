
// Import supabase client
import { supabase } from '@/integrations/supabase/client';

// Re-export from refactored modules
export * from './batch-operations';
export * from './counter-operations';
export * from './content-interactions';
export * from './supabase-helpers';
export * from './interactions/types';
export * from './interactions/user-interactions-check';
export * from './interactions/toggle-interactions';
export * from './interactions/like-operations';
export * from './interactions/bookmark-operations';

// Type definitions as common foundation
export interface CounterOptions {
  contentId: string;
  counterName: string;
  tableName: string;
  silent?: boolean;
}
