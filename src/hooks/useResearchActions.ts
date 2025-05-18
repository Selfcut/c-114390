
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from "@/hooks/use-toast";
import { ResearchPaper } from '@/lib/supabase-types';

export const useResearchActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Create a new research paper
  const createResearchPaper = async (paper: Omit<ResearchPaper, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create research papers",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('research_papers')
        .insert({
          ...paper,
          user_id: user.id
        })
        .select() as { data: ResearchPaper | null, error: any };
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Research paper created",
        description: "Your research paper has been published successfully"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating research paper:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create research paper",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an existing research paper
  const updateResearchPaper = async (id: string, updates: Partial<ResearchPaper>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update research papers",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('research_papers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id) as { error: any };
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Research paper updated",
        description: "Your changes have been saved successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating research paper:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update research paper",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a research paper
  const deleteResearchPaper = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete research papers",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('research_papers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) as { error: any };
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Research paper deleted",
        description: "The research paper has been removed successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting research paper:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete research paper",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Increment view count using the RPC function
  const incrementViewCount = async (id: string) => {
    try {
      await supabase.rpc('increment_research_views', { paper_id: id }) as { error: any };
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };
  
  // Toggle like on a research paper using the RPC function
  const toggleLike = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like research papers",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const { data, error } = await supabase.rpc('toggle_research_like', { 
        paper_id: id,
        user_id: user.id
      }) as { data: boolean, error: any };
      
      if (error) {
        throw error;
      }
      
      return data; // Returns true if liked, false if unliked
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update like status",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    createResearchPaper,
    updateResearchPaper,
    deleteResearchPaper,
    incrementViewCount,
    toggleLike,
    isLoading
  };
};
