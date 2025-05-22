
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useDebounce } from './useDebounce';
import { toast } from 'sonner';

export interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type NoteCreateInput = Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type NoteUpdateInput = Partial<Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export const useNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchNotes = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Note[];
  };

  const fetchNoteById = async (id: string) => {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Note;
  };

  const {
    data: notes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    enabled: !!user
  });

  const createNote = useMutation({
    mutationFn: async (newNote: NoteCreateInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          ...newNote,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      toast.error('Failed to save note');
    }
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, noteData }: { id: string, noteData: NoteUpdateInput }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_notes')
        .update(noteData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  });

  // Auto-save functionality
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle' | 'error'>('idle');

  const useAutoSaveNote = (
    id: string | undefined,
    content: string,
    debounceMs: number = 1000
  ) => {
    const debouncedContent = useDebounce(content, debounceMs);

    const autoSave = useCallback(async () => {
      if (!id || !debouncedContent || !user) return;
      
      setAutoSaveStatus('saving');
      try {
        await updateNote.mutateAsync({ id, noteData: { content: debouncedContent } });
        setAutoSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('error');
      }
    }, [id, debouncedContent]);

    // Effect to trigger auto-save when debounced content changes
    useEffect(() => {
      if (debouncedContent && id) {
        autoSave();
      }
    }, [debouncedContent, id, autoSave]);

    return {
      autoSaveStatus,
      resetStatus: () => setAutoSaveStatus('idle')
    };
  };

  const useNote = (id: string | undefined) => {
    return useQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id!),
      enabled: !!id && !!user
    });
  };

  return {
    notes,
    isLoading,
    error,
    refetch,
    createNote,
    updateNote,
    deleteNote,
    useAutoSaveNote,
    useNote,
    autoSaveStatus
  };
};
