
// Import supabase client
import { supabase } from '@/integrations/supabase/client';

// Re-export from refactored modules
export * from './batch-operations';
export * from './counter-operations';
export * from './content-interactions';

// Type definitions as common foundation
export interface CounterOptions {
  contentId: string;
  counterName: string;
  tableName: string;
  silent?: boolean;
}

// Simple interface for Supabase query results to avoid deep type inference
export interface QueryResult {
  data: any;
  error: any;
}
