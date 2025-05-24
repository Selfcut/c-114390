
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { useDebounce } from './useDebounce';

export interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const fetchNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          content,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setNotes(prev => [data, ...prev]);
      toast.success('Note created');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_notes')
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setNotes(prev => prev.map(note => note.id === data.id ? data : note));
      toast.success('Note updated');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  });

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const useAutoSaveNote = (noteId?: string, content?: string) => {
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const debouncedContent = useDebounce(content, 2000);

    useEffect(() => {
      if (!noteId || !debouncedContent || !updateNote) return;

      const saveNote = async () => {
        setAutoSaveStatus('saving');
        try {
          await updateNote.mutateAsync({
            id: noteId,
            content: debouncedContent
          });
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch (error) {
          setAutoSaveStatus('error');
          setTimeout(() => setAutoSaveStatus('idle'), 3000);
        }
      };

      saveNote();
    }, [debouncedContent, noteId]);

    return { autoSaveStatus };
  };

  return {
    notes,
    isLoading,
    createNote: (content: string) => createNote.mutateAsync(content),
    updateNote: (id: string, content: string) => updateNote.mutateAsync({ id, content }),
    deleteNote: (id: string) => deleteNote.mutateAsync(id),
    refreshNotes: fetchNotes,
    useAutoSaveNote
  };
};
