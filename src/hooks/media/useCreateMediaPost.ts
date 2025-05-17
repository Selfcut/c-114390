
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { validateMediaType } from "@/utils/mediaUtils";

interface MediaPostData {
  title: string;
  content?: string;
  type: string;
  url?: string;
  file?: File;
}

export const useCreateMediaPost = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to upload a file and get its URL
  const uploadMediaFile = async (file: File): Promise<string> => {
    if (!userId) throw new Error("User not authenticated");
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;
    
    setUploadProgress(10); // Starting upload
    
    try {
      // Create a custom upload function that can track progress
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Simulate progress steps since we can't directly track it
      setUploadProgress(70);
      
      if (uploadError) throw uploadError;
      
      setUploadProgress(90);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      setUploadProgress(100); // Upload completed
      
      return publicUrl;
    } catch (error) {
      setUploadProgress(0); // Reset on error
      throw error;
    }
  };

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: MediaPostData) => {
      if (!userId) throw new Error("User not authenticated");
      
      let url = postData.url;
      
      // If a file was provided, upload it
      if (postData.file) {
        url = await uploadMediaFile(postData.file);
      }
      
      // Validate the media type
      const validatedType = validateMediaType(postData.type);
      
      // Insert the post into the database
      const { data, error } = await supabase
        .from('media_posts')
        .insert([
          {
            title: postData.title,
            content: postData.content || '',
            type: validatedType,
            url: url || null,
            user_id: userId,
            likes: 0,
            comments: 0
          }
        ])
        .select();
        
      if (error) throw error;
      
      return data;
    },
    meta: {
      onSuccess: () => {
        toast({
          title: "Post created",
          description: "Your media has been shared successfully",
        });
        onSuccess();
        setUploadProgress(0); // Reset progress
      },
      onError: (error: Error) => {
        console.error("Error creating post:", error);
        toast({
          title: "Failed to create post",
          description: error.message || "An error occurred while creating your post",
          variant: "destructive"
        });
        setUploadProgress(0); // Reset progress
      }
    }
  });

  // Handle create post function
  const handleCreatePost = async (postData: MediaPostData) => {
    try {
      await createPostMutation.mutateAsync(postData);
    } catch (error) {
      console.error("Error in handleCreatePost:", error);
      setUploadProgress(0); // Ensure progress is reset on error
    }
  };

  return {
    createPostMutation,
    handleCreatePost,
    uploadProgress
  };
};
