
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export interface Word {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  category: string;
  user_id: string;
}

export type WordCreateInput = Omit<Word, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type WordUpdateInput = Partial<Omit<Word, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export const useWords = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'private' | 'public'>('all');

  const fetchWords = async () => {
    if (!user) return { data: [] };
    
    let query = supabase
      .from('words')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (filter === 'private') {
      query = query.eq('is_public', false);
    } else if (filter === 'public') {
      query = query.eq('is_public', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data as Word[];
  };

  const fetchPublicWords = async () => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('is_public', true)
      .order('updated_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Word[];
  };

  const fetchWordById = async (id: string) => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Word;
  };

  const {
    data: words = [],
    isLoading: isLoadingWords,
    error: wordsError,
    refetch: refetchWords
  } = useQuery({
    queryKey: ['words', filter],
    queryFn: fetchWords,
    enabled: !!user
  });

  const {
    data: publicWords = [],
    isLoading: isLoadingPublicWords,
    error: publicWordsError,
  } = useQuery({
    queryKey: ['public-words'],
    queryFn: fetchPublicWords
  });

  const createWord = useMutation({
    mutationFn: async (newWord: WordCreateInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('words')
        .insert({
          ...newWord,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['public-words'] });
      toast.success('Successfully created your writing');
    },
    onError: (error) => {
      console.error('Error creating word:', error);
      toast.error('Failed to create writing');
    }
  });

  const updateWord = useMutation({
    mutationFn: async ({ id, wordData }: { id: string, wordData: WordUpdateInput }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('words')
        .update(wordData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['public-words'] });
      queryClient.invalidateQueries({ queryKey: ['word', variables.id] });
      toast.success('Successfully updated your writing');
    },
    onError: (error) => {
      console.error('Error updating word:', error);
      toast.error('Failed to update writing');
    }
  });

  const deleteWord = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['public-words'] });
      toast.success('Successfully deleted your writing');
    },
    onError: (error) => {
      console.error('Error deleting word:', error);
      toast.error('Failed to delete writing');
    }
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string, isPublic: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('words')
        .update({ is_public: isPublic })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['public-words'] });
      queryClient.invalidateQueries({ queryKey: ['word', variables.id] });
      toast.success(`Successfully made your writing ${variables.isPublic ? 'public' : 'private'}`);
    },
    onError: (error) => {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  });

  const useWord = (id: string | undefined) => {
    return useQuery({
      queryKey: ['word', id],
      queryFn: () => fetchWordById(id!),
      enabled: !!id && !!user
    });
  };

  return {
    words,
    publicWords,
    isLoadingWords,
    isLoadingPublicWords,
    wordsError,
    publicWordsError,
    filter,
    setFilter,
    refetchWords,
    createWord,
    updateWord,
    deleteWord,
    toggleVisibility,
    useWord
  };
};
