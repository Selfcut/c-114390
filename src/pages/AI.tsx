
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AIChat } from "@/components/ai/AIChat";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Image, Search, FileText, Loader2 } from "lucide-react";

const AI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    
    try {
      // Track user activity
      if (user) {
        await supabase.functions.invoke('track-user-activity', {
          body: {
            event: 'generate_image',
            userId: user.id,
            metadata: { prompt: imagePrompt }
          }
        });
      }
      
      // Mock image generation for now - in a real implementation, you would
      // call an AI service to generate the image
      setTimeout(() => {
        setGeneratedImage(`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(imagePrompt)}`);
        setIsGeneratingImage(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
      setIsGeneratingImage(false);
    }
  };

  const generateText = async () => {
    if (!textPrompt.trim()) return;
    
    setIsGeneratingText(true);
    setGeneratedText("");
    
    try {
      // Track user activity
      if (user) {
        await supabase.functions.invoke('track-user-activity', {
          body: {
            event: 'generate_text',
            userId: user.id,
            metadata: { prompt: textPrompt }
          }
        });
      }
      
      const response = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt: textPrompt }
      });
      
      const responseData = response.data as { generatedText: string } | undefined;
      
      if (responseData?.generatedText) {
        setGeneratedText(responseData.generatedText);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error generating text:', error);
      toast({
        title: "Error",
        description: "Failed to generate text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingText(false);
    }
  };

  return (
    <PageLayout>
      <main className="container py-8">
        <div className="flex items-center gap-2 mb-8">
          <Bot size={28} className="text-primary" />
          <h1 className="text-3xl font-bold">AI Laboratory</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Explore the power of artificial intelligence to enhance your academic research and learning journey.
        </p>
        
        <Tabs defaultValue="chat">
          <TabsList className="mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot size={16} />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image size={16} />
              <span>Image Generation</span>
            </TabsTrigger>
            <TabsTrigger value="writing" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Academic Writing</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <AIChat />
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Images</CardTitle>
                <CardDescription>
                  Create images based on your descriptions using AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="image-prompt">Your image description</label>
                  <div className="flex gap-2">
                    <Input 
                      id="image-prompt"
                      placeholder="Describe the image you want to generate..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      disabled={isGeneratingImage}
                    />
                    <Button 
                      onClick={generateImage} 
                      disabled={!imagePrompt.trim() || isGeneratingImage}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Image className="mr-2 h-4 w-4" />
                      )}
                      Generate
                    </Button>
                  </div>
                </div>
                
                {isGeneratingImage ? (
                  <div className="flex justify-center items-center p-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                      <p className="text-muted-foreground">Generating your image...</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="border rounded-lg p-2 bg-muted/30 w-full max-w-md">
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-auto rounded"
                      />
                    </div>
                    <Button variant="outline" onClick={() => setGeneratedImage(null)}>
                      Clear Image
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="writing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Writing Assistant</CardTitle>
                <CardDescription>
                  Generate structured academic content for research papers, essays, and literature reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="text-prompt">What would you like to write about?</label>
                  <Textarea
                    id="text-prompt"
                    placeholder="Describe your writing need (e.g., 'Write an introduction paragraph about the effects of climate change on marine ecosystems')"
                    className="min-h-[100px]"
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    disabled={isGeneratingText}
                  />
                  <Button
                    className="mt-2"
                    onClick={generateText}
                    disabled={!textPrompt.trim() || isGeneratingText}
                  >
                    {isGeneratingText ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" />
                    )}
                    Generate Content
                  </Button>
                </div>
                
                {isGeneratingText ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                      <p className="text-muted-foreground">Crafting your content...</p>
                    </div>
                  </div>
                ) : generatedText ? (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Generated Content:</h3>
                    <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap">
                      {generatedText}
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" onClick={() => setGeneratedText("")}>
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
};

export default AI;
