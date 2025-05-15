
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileType, RefreshCw, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAIInteractionTracking } from "@/lib/analytics";

export function AIContentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("essay");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();
  const { trackAIInteraction } = useAIInteractionTracking();
  
  const contentTypes = [
    { value: "essay", label: "Essay" },
    { value: "article", label: "Article" },
    { value: "blog-post", label: "Blog Post" },
    { value: "summary", label: "Summary" },
    { value: "outline", label: "Outline" },
    { value: "script", label: "Script" },
    { value: "research", label: "Research" },
  ];
  
  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a prompt for content generation",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setGeneratedContent("");
    
    try {
      // Prepare the full prompt with content type and topic
      const fullPrompt = `Generate a ${contentType} about ${topic || "the requested topic"}: ${prompt}`;
      
      // Track this AI interaction
      trackAIInteraction('content-generator', fullPrompt, 0, { contentType });
      
      // Call the Edge Function for AI generation
      const response = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt: fullPrompt }
      });
      
      const responseData = response.data as { generatedText: string } | undefined;
      
      if (responseData?.generatedText) {
        setGeneratedContent(responseData.generatedText);
        trackAIInteraction('content-generator', fullPrompt, responseData.generatedText.length, { 
          contentType,
          success: true 
        });
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Content Generation Failed",
        description: "We couldn't generate the requested content. Please try again.",
        variant: "destructive"
      });
      trackAIInteraction('content-generator', prompt, 0, { 
        contentType,
        error: error.message,
        success: false 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard"
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileType size={20} className="text-primary" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="content-type" className="block text-sm font-medium mb-2">
              Content Type
            </label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Topic (Optional)
            </label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a specific topic"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Prompt
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={3}
            className="resize-none"
          />
        </div>
        
        <Button 
          onClick={generateContent} 
          disabled={loading || !prompt.trim()} 
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Content</>
          )}
        </Button>
        
        {generatedContent && (
          <div className="border rounded-md p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Generated Content</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={generateContent}>
                  <RefreshCw size={14} className="mr-1" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy size={14} className="mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-sm">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
