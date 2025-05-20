
import { supabase } from '@/integrations/supabase/client';

/**
 * This file contains utility functions for working with Supabase
 */

// Function to initialize any Supabase-specific functionality
export const initializeSupabaseUtils = async () => {
  try {
    // Set up the realtime listeners for specific tables
    setupRealtimeSubscriptions();
    
    // Verify the connection to Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error initializing Supabase utils:', error);
    } else {
      console.log('Supabase utils initialized');
    }
  } catch (error) {
    console.error('Error in initializeSupabaseUtils:', error);
  }
};

// Set up realtime subscriptions for key tables
const setupRealtimeSubscriptions = () => {
  // Subscribe to chat messages for realtime updates
  const chatChannel = supabase
    .channel('public:chat_messages')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'chat_messages' 
    }, (payload) => {
      console.log('Chat message update:', payload);
    })
    .subscribe();
    
  // Subscribe to events for realtime updates
  const eventsChannel = supabase
    .channel('public:events')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'events'
    }, (payload) => {
      console.log('Events update:', payload);
    })
    .subscribe();
    
  // Subscribe to research papers for realtime updates
  const researchChannel = supabase
    .channel('public:research_papers')
    .on('postgres_changes', {
      event: '*', 
      schema: 'public',
      table: 'research_papers'
    }, (payload) => {
      console.log('Research papers update:', payload);
    })
    .subscribe();
    
  // Return the cleanup function
  return () => {
    supabase.removeChannel(chatChannel);
    supabase.removeChannel(eventsChannel);
    supabase.removeChannel(researchChannel);
  };
};

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  return {
    error: {
      message: error.message || 'An unexpected error occurred',
      details: error.details || null,
      context
    }
  };
};

// Check if a user has permission to modify content
export const hasEditPermission = (
  userId: string | undefined, 
  contentUserId: string | undefined, 
  userRole: string = 'user'
) => {
  if (!userId) return false;
  if (userRole === 'admin' || userRole === 'moderator') return true;
  return userId === contentUserId;
};

// Function to increment a counter in a table
export const incrementCounter = async (
  rowId: string, 
  columnName: string, 
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('increment_counter', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error(`Error incrementing ${columnName} in ${tableName}:`, error);
  }
};

// Function to decrement a counter in a table
export const decrementCounter = async (
  rowId: string, 
  columnName: string, 
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('decrement_counter', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error(`Error decrementing ${columnName} in ${tableName}:`, error);
  }
};
