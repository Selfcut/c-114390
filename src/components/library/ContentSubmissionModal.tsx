
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { BookOpen, Image, Quote, Brain } from 'lucide-react';

// Import form components
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

export const ContentSubmissionModal = ({ 
  isOpen, 
  onOpenChange, 
  defaultTab = 'knowledge',
  onSubmitSuccess 
}: ContentSubmissionModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Knowledge entry form state
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
    type: 'image' as 'image' | 'video' | 'document' | 'youtube' | 'text',
    file: null as File | null,
    youtubeUrl: ''
  });
  
  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    text: '',
    author: '',
    source: '',
    tags: ''
  });
  
  // AI form state
  const [aiForm, setAiForm] = useState({
    prompt: '',
    generatedContent: '',
    title: ''
  });

  // Update knowledge form state
  const updateKnowledgeForm = (updates: Partial<typeof knowledgeForm>) => {
    setKnowledgeForm(prev => ({ ...prev, ...updates }));
  };

  // Update media form state
  const updateMediaForm = (updates: Partial<typeof mediaForm>) => {
    setMediaForm(prev => ({ ...prev, ...updates }));
  };

  // Update quote form state
  const updateQuoteForm = (updates: Partial<typeof quoteForm>) => {
    setQuoteForm(prev => ({ ...prev, ...updates }));
  };

  // Update AI form state
  const updateAIForm = (updates: Partial<typeof aiForm>) => {
    setAiForm(prev => ({ ...prev, ...updates }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit content",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      switch(activeTab) {
        case 'knowledge':
          await submitKnowledgeEntry();
          break;
        case 'media':
          await submitMedia();
          break;
        case 'quote':
          await submitQuote();
          break;
        case 'ai':
          await submitAiContent();
          break;
      }
      
      // Close modal and notify success
      onOpenChange(false);
      onSubmitSuccess?.();
      
      // Reset form states
      resetForms();
      
      toast({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content submitted`,
        description: "Your content has been published successfully!"
      });
    } catch (error: any) {
      console.error(`Error submitting ${activeTab} content:`, error);
      toast({
        title: "Submission failed",
        description: error.message || `Failed to submit ${activeTab} content`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      type: 'image',
      file: null,
      youtubeUrl: ''
    });
    
    setQuoteForm({
      text: '',
      author: '',
      source: '',
      tags: ''
    });
    
    setAiForm({
      prompt: '',
      generatedContent: '',
      title: ''
    });
  };
  
  // Submit knowledge entry
  const submitKnowledgeEntry = async () => {
    const { title, summary, content, categories, coverImage } = knowledgeForm;
    
    if (!title || !summary) {
      throw new Error("Title and summary are required");
    }
    
    let coverImageUrl = null;
    
    // Upload cover image if provided
    if (coverImage) {
      const fileName = `${Date.now()}-${coverImage.name}`;
      const filePath = `knowledge/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('content')
        .upload(filePath, coverImage);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('content')
        .getPublicUrl(filePath);
        
      coverImageUrl = publicUrl;
    }
    
    // Insert knowledge entry
    const { error } = await supabase
      .from('knowledge_entries')
      .insert({
        title,
        summary,
        content,
        categories: categories.split(',').map(tag => tag.trim()),
        cover_image: coverImageUrl,
        user_id: user.id,
        is_ai_generated: false
      } as any);
      
    if (error) throw error;
  };
  
  // Submit media
  const submitMedia = async () => {
    const { title, content, type, file, youtubeUrl } = mediaForm;
    
    if (!title) {
      throw new Error("Title is required");
    }
    
    if (type === 'youtube' && !youtubeUrl) {
      throw new Error("YouTube URL is required");
    }
    
    if ((type === 'image' || type === 'video' || type === 'document') && !file) {
      throw new Error("File is required");
    }
    
    let fileUrl = null;
    
    // Upload file if provided
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `media/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('content')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('content')
        .getPublicUrl(filePath);
        
      fileUrl = publicUrl;
    }
    
    // Insert media post
    const { error } = await supabase
      .from('media_posts')
      .insert({
        title,
        content,
        type,
        url: type === 'youtube' ? youtubeUrl : fileUrl,
        user_id: user.id
      });
      
    if (error) throw error;
  };
  
  // Submit quote
  const submitQuote = async () => {
    const { text, author, source, tags } = quoteForm;
    
    if (!text || !author) {
      throw new Error("Quote text and author are required");
    }
    
    // Insert quote
    const { error } = await supabase
      .from('quotes')
      .insert({
        text,
        author,
        source,
        tags: tags.split(',').map(tag => tag.trim()),
        user_id: user.id,
        category: 'General' // Default category
      });
      
    if (error) throw error;
  };
  
  // Generate and submit AI content
  const submitAiContent = async () => {
    const { prompt, generatedContent, title } = aiForm;
    
    if (!prompt || !generatedContent || !title) {
      throw new Error("Prompt, generated content, and title are required");
    }
    
    // Insert AI-generated content as a knowledge entry
    const { error } = await supabase
      .from('knowledge_entries')
      .insert({
        title,
        summary: `AI-generated content based on prompt: ${prompt}`,
        content: generatedContent,
        categories: ['AI-Generated'],
        user_id: user.id,
        is_ai_generated: true
      } as any);
      
    if (error) throw error;
  };
  
  // Generate content with AI
  const generateWithAI = async () => {
    const { prompt } = aiForm;
    
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate content",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/generate-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      
      updateAIForm({
        generatedContent: data.generatedText,
        title: aiForm.title || `AI Content: ${prompt.slice(0, 30)}...`
      });
      
    } catch (error: any) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image size={16} />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="quote" className="flex items-center gap-2">
              <Quote size={16} />
              <span className="hidden sm:inline">Quote</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain size={16} />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="knowledge">
              <KnowledgeEntryForm 
                formState={knowledgeForm}
                onChange={updateKnowledgeForm}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="media">
              <MediaForm 
                formState={mediaForm}
                onChange={updateMediaForm}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="quote">
              <QuoteForm 
                formState={quoteForm}
                onChange={updateQuoteForm}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="ai">
              <AIGeneratorForm 
                formState={aiForm}
                onChange={updateAIForm}
                onGenerateContent={generateWithAI}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
