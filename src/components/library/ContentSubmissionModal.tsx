
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth"; 
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Form components
import { KnowledgeEntryForm } from './forms/KnowledgeEntryForm';
import { MediaForm } from './forms/MediaForm';
import { QuoteForm } from './forms/QuoteForm';
import { AIGeneratorForm } from './forms/AIGeneratorForm';

interface ContentSubmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'knowledge' | 'media' | 'quote' | 'ai';
  onSubmitSuccess?: () => void;
}

export const ContentSubmissionModal: React.FC<ContentSubmissionModalProps> = ({
  isOpen,
  onOpenChange,
  defaultTab = 'knowledge',
  onSubmitSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Knowledge form state
  const [knowledgeForm, setKnowledgeForm] = useState({
    title: '',
    summary: '',
    content: '',
    categories: '',
    coverImage: null as File | null
  });
  
  // Media form state
  const [mediaForm, setMediaForm] = useState({
    title: '',
    content: '',
    mediaType: 'image' as 'image' | 'video' | 'document' | 'youtube' | 'text',
    mediaUrl: '',
    mediaFile: null as File | null
  });
  
  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    text: '',
    author: '',
    source: '',
    category: '',
    tags: ''
  });
  
  // AI Generation form state
  const [aiForm, setAiForm] = useState({
    prompt: '',
    category: '',
    outputType: 'knowledge'
  });

  // Reset all form states
  const resetForms = () => {
    setKnowledgeForm({
      title: '',
      summary: '',
      content: '',
      categories: '',
      coverImage: null
    });
    
    setMediaForm({
      title: '',
      content: '',
      mediaType: 'image',
      mediaUrl: '',
      mediaFile: null
    });
    
    setQuoteForm({
      text: '',
      author: '',
      source: '',
      category: '',
      tags: ''
    });
    
    setAiForm({
      prompt: '',
      category: '',
      outputType: 'knowledge'
    });
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'knowledge' | 'media' | 'quote' | 'ai');
  };
  
  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForms();
    }
    onOpenChange(open);
  };

  // Upload file to Supabase storage
  const uploadFile = async (file: File, type: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}/${uuidv4()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('content')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  };
  
  // Handle knowledge entry submission
  const handleKnowledgeSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!knowledgeForm.title || !knowledgeForm.summary) {
        throw new Error('Title and summary are required');
      }
      
      // Process categories
      const categories = knowledgeForm.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);
      
      // Upload cover image if provided
      let coverImageUrl = '';
      if (knowledgeForm.coverImage) {
        coverImageUrl = await uploadFile(knowledgeForm.coverImage, 'knowledge-covers');
      }
      
      // Create knowledge entry in database
      const { data, error } = await supabase
        .from('knowledge_entries')
        .insert({
          title: knowledgeForm.title,
          summary: knowledgeForm.summary,
          content: knowledgeForm.content,
          categories: categories,
          cover_image: coverImageUrl,
          user_id: user.id,
          is_ai_generated: false
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Knowledge entry published",
        description: "Your contribution has been published successfully!"
      });
      
      handleOpenChange(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (err: any) {
      console.error('Error submitting knowledge entry:', err);
      toast({
        title: "Submission failed",
        description: err.message || "Failed to publish knowledge entry",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle media submission
  const handleMediaSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!mediaForm.title) {
        throw new Error('Title is required');
      }
      
      if (mediaForm.mediaType !== 'text' && !mediaForm.mediaUrl && !mediaForm.mediaFile) {
        throw new Error('Please provide media URL or upload a file');
      }
      
      // Process media URL or file
      let mediaUrl = mediaForm.mediaUrl;
      
      if (mediaForm.mediaFile) {
        mediaUrl = await uploadFile(mediaForm.mediaFile, 'media');
      }
      
      // Create media post in database
      const { data, error } = await supabase
        .from('media_posts')
        .insert({
          title: mediaForm.title,
          content: mediaForm.content,
          type: mediaForm.mediaType,
          url: mediaUrl,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Media published",
        description: "Your media post has been published successfully!"
      });
      
      handleOpenChange(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (err: any) {
      console.error('Error submitting media:', err);
      toast({
        title: "Submission failed",
        description: err.message || "Failed to publish media",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle quote submission
  const handleQuoteSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!quoteForm.text || !quoteForm.author) {
        throw new Error('Quote text and author are required');
      }
      
      // Process tags
      const tags = quoteForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      // Create quote in database
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          text: quoteForm.text,
          author: quoteForm.author,
          source: quoteForm.source,
          category: quoteForm.category || 'General',
          tags: tags,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Quote published",
        description: "Your quote has been published successfully!"
      });
      
      handleOpenChange(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      toast({
        title: "Submission failed",
        description: err.message || "Failed to publish quote",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle AI generation
  const handleAIGenerate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use AI generation",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!aiForm.prompt) {
        throw new Error('Please provide a prompt for the AI');
      }
      
      // TODO: Implement AI generation logic here or call an edge function
      
      toast({
        title: "Generation started",
        description: "AI is generating content based on your prompt. This may take a moment."
      });
      
      // Simulate AI generation with timeout
      setTimeout(() => {
        toast({
          title: "Generation complete",
          description: "AI has generated content based on your prompt!"
        });
        
        setIsSubmitting(false);
        
        // Populate the appropriate form with the generated content
        if (aiForm.outputType === 'knowledge') {
          setKnowledgeForm({
            title: `AI Generated: ${aiForm.prompt.substring(0, 30)}...`,
            summary: `AI generated content based on the prompt: ${aiForm.prompt}`,
            content: `This is AI generated content based on the prompt: "${aiForm.prompt}".\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            categories: aiForm.category || 'AI-Generated',
            coverImage: null
          });
          setActiveTab('knowledge');
        } else if (aiForm.outputType === 'quote') {
          setQuoteForm({
            text: "Life's challenges are not supposed to paralyze you; they're supposed to help you discover who you are.",
            author: "Bernice Johnson Reagon",
            source: "AI Generated",
            category: aiForm.category || 'Inspirational',
            tags: 'ai-generated,wisdom'
          });
          setActiveTab('quote');
        }
      }, 2000);
      
    } catch (err: any) {
      console.error('Error generating with AI:', err);
      toast({
        title: "Generation failed",
        description: err.message || "Failed to generate content",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  // Handle submission based on active tab
  const handleSubmit = () => {
    switch (activeTab) {
      case 'knowledge':
        return handleKnowledgeSubmit();
      case 'media':
        return handleMediaSubmit();
      case 'quote':
        return handleQuoteSubmit();
      case 'ai':
        return handleAIGenerate();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Contribute Content</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="quote">Quote</TabsTrigger>
            <TabsTrigger value="ai">AI Generate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="knowledge" className="space-y-4">
            <KnowledgeEntryForm
              formState={knowledgeForm}
              onChange={(updates) => setKnowledgeForm(prev => ({...prev, ...updates}))}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <MediaForm 
              formState={mediaForm}
              onChange={(updates) => setMediaForm(prev => ({...prev, ...updates}))}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="quote" className="space-y-4">
            <QuoteForm 
              formState={quoteForm}
              onChange={(updates) => setQuoteForm(prev => ({...prev, ...updates}))}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <AIGeneratorForm 
              formState={aiForm}
              onChange={(updates) => setAiForm(prev => ({...prev, ...updates}))}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {activeTab === 'ai' ? 'Generate' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
