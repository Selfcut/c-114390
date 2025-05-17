
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MediaPost } from '@/utils/mediaUtils';
import { CreatePostData, CreatePostResponse } from './types';

export const useCreateMediaPost = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);

  const createPostMutation = useMutation({
    mutationFn: async ({ title, content, url, type, tags }: { 
      title: string; 
      content?: string; 
      url?: string; 
      type: string;
      tags?: string[];
    }): Promise<CreatePostResponse> => {
      if (!userId) {
        throw new Error('User must be authenticated to create a post');
      }

      // Create media post in database
      const { data, error } = await supabase
        .from('media_posts')
        .insert({
          title,
          content,
          url,
          type,
          user_id: userId,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your post has been created',
      });
      onSuccess(); // Call the success callback
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating post',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  });

  // Helper function to handle file uploads and create posts
  const handleCreatePost = async (data: CreatePostData): Promise<CreatePostResponse | null> => {
    try {
      let url;
      
      // If there's a file, upload it first
      if (data.file && userId) {
        const fileExt = data.file.name.split('.').pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        
        // Check if media storage bucket exists, create if not
        const { data: bucketExists } = await supabase.storage.getBucket('media');
        
        if (!bucketExists) {
          await supabase.storage.createBucket('media', { public: true });
        }
        
        // Track upload progress
        const uploadProgressCallback = (progress: { loaded: number; total: number }) => {
          setUploadProgress((progress.loaded / progress.total) * 100);
        };
        
        // Upload file to storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('media')
          .upload(filePath, data.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
          
        url = publicUrlData.publicUrl;
      }
      
      // Create the post with the file URL if applicable
      const response = await createPostMutation.mutateAsync({
        title: data.title,
        content: data.content,
        url,
        type: data.type,
        tags: data.tags
      });
      
      return response;
    } catch (error: any) {
      console.error('Error in handleCreatePost:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadProgress(0);
    }
  };

  return {
    createPostMutation,
    handleCreatePost,
    uploadProgress,
  };
};
