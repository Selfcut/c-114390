
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

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

  const createNote = async (content: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          content,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      toast.success('Note created');
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
      return null;
    }
  };

  const updateNote = async (id: string, content: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note => note.id === id ? data : note));
      toast.success('Note updated');
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      return false;
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted');
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
};
