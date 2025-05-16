import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { BookOpen, Image, Quote, Brain } from 'lucide-react';

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
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'knowledge' | 'media') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (formType === 'knowledge') {
      setKnowledgeForm(prev => ({ ...prev, coverImage: file }));
    } else {
      setMediaForm(prev => ({ ...prev, file }));
    }
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
      
      const { error: uploadError, data } = await supabase
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
    
    // Insert knowledge entry with typed query
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
    
    toast({
      title: "Knowledge entry created",
      description: "Your knowledge entry has been published successfully!"
    });
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
      
      const { error: uploadError, data } = await supabase
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
    
    toast({
      title: "Media post created",
      description: "Your media post has been published successfully!"
    });
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
    
    toast({
      title: "Quote submitted",
      description: "Your quote has been published successfully!"
    });
  };
  
  // Generate and submit AI content
  const submitAiContent = async () => {
    const { prompt, generatedContent, title } = aiForm;
    
    if (!prompt || !generatedContent || !title) {
      throw new Error("Prompt, generated content, and title are required");
    }
    
    // Insert AI-generated content as a knowledge entry with typed query
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
    
    toast({
      title: "AI content created",
      description: "Your AI-generated content has been published successfully!"
    });
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
      
      setAiForm(prev => ({
        ...prev,
        generatedContent: data.generatedText,
        title: prev.title || `AI Content: ${prompt.slice(0, 30)}...`
      }));
      
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
            {/* Knowledge Entry Form */}
            <TabsContent value="knowledge" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="knowledge-title">Title</Label>
                <Input 
                  id="knowledge-title" 
                  placeholder="Knowledge entry title" 
                  value={knowledgeForm.title}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="knowledge-summary">Summary</Label>
                <Textarea 
                  id="knowledge-summary" 
                  placeholder="A brief summary of this knowledge entry"
                  value={knowledgeForm.summary}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="knowledge-content">Content</Label>
                <Textarea 
                  id="knowledge-content" 
                  placeholder="The full content of your knowledge entry"
                  value={knowledgeForm.content}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="knowledge-categories">Categories</Label>
                <Input 
                  id="knowledge-categories" 
                  placeholder="Comma-separated categories (e.g. Philosophy, Science)" 
                  value={knowledgeForm.categories}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, categories: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="knowledge-cover">Cover Image</Label>
                <Input 
                  id="knowledge-cover" 
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'knowledge')}
                />
              </div>
            </TabsContent>
            
            {/* Media Form */}
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="media-title">Title</Label>
                <Input 
                  id="media-title" 
                  placeholder="Media post title" 
                  value={mediaForm.title}
                  onChange={(e) => setMediaForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="media-content">Description</Label>
                <Textarea 
                  id="media-content" 
                  placeholder="Description of your media post"
                  value={mediaForm.content}
                  onChange={(e) => setMediaForm(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="media-type">Media Type</Label>
                <select 
                  id="media-type"
                  value={mediaForm.type}
                  onChange={(e) => setMediaForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="youtube">YouTube</option>
                  <option value="text">Text Only</option>
                </select>
              </div>
              
              {mediaForm.type === 'youtube' ? (
                <div className="space-y-2">
                  <Label htmlFor="media-youtube">YouTube URL</Label>
                  <Input 
                    id="media-youtube" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={mediaForm.youtubeUrl}
                    onChange={(e) => setMediaForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  />
                </div>
              ) : mediaForm.type !== 'text' && (
                <div className="space-y-2">
                  <Label htmlFor="media-file">File</Label>
                  <Input 
                    id="media-file" 
                    type="file"
                    accept={
                      mediaForm.type === 'image' 
                        ? 'image/*' 
                        : mediaForm.type === 'video' 
                        ? 'video/*' 
                        : mediaForm.type === 'document' 
                        ? '.pdf,.doc,.docx' 
                        : '*'
                    }
                    onChange={(e) => handleFileChange(e, 'media')}
                  />
                </div>
              )}
            </TabsContent>
            
            {/* Quote Form */}
            <TabsContent value="quote" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quote-text">Quote</Label>
                <Textarea 
                  id="quote-text" 
                  placeholder="Enter the quote text"
                  value={quoteForm.text}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, text: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quote-author">Author</Label>
                <Input 
                  id="quote-author" 
                  placeholder="Quote author" 
                  value={quoteForm.author}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quote-source">Source (Optional)</Label>
                <Input 
                  id="quote-source" 
                  placeholder="Book, speech, etc." 
                  value={quoteForm.source}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, source: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quote-tags">Tags</Label>
                <Input 
                  id="quote-tags" 
                  placeholder="Comma-separated tags (e.g. Inspiration, Philosophy)" 
                  value={quoteForm.tags}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </TabsContent>
            
            {/* AI Content Form */}
            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Prompt</Label>
                <Textarea 
                  id="ai-prompt" 
                  placeholder="Enter a prompt for AI to generate content"
                  value={aiForm.prompt}
                  onChange={(e) => setAiForm(prev => ({ ...prev, prompt: e.target.value }))}
                  className="min-h-[80px]"
                />
                <Button 
                  type="button" 
                  onClick={generateWithAI}
                  disabled={isSubmitting || !aiForm.prompt}
                  className="w-full"
                >
                  {isSubmitting ? "Generating..." : "Generate Content"}
                </Button>
              </div>
              
              {aiForm.generatedContent && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-title">Title</Label>
                    <Input 
                      id="ai-title" 
                      placeholder="Title for the generated content" 
                      value={aiForm.title}
                      onChange={(e) => setAiForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-content">Generated Content</Label>
                    <Textarea 
                      id="ai-content" 
                      placeholder="AI-generated content will appear here"
                      value={aiForm.generatedContent}
                      onChange={(e) => setAiForm(prev => ({ ...prev, generatedContent: e.target.value }))}
                      className="min-h-[200px]"
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
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
