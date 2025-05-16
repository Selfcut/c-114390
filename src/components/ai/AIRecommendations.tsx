
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  RefreshCw, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Loader2,
  Radio,
  Users
} from 'lucide-react';
import { Book, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";

interface Recommendation {
  id: string;
  type: 'book' | 'user' | 'podcast' | 'course';
  title: string;
  description: string;
  imageUrl?: string;
  author?: string;
  url?: string;
  relevanceScore?: number;
  tags: string[];
}

export function AIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const recommendationTypes = [
    { id: 'books', label: 'Books', icon: Book },
    { id: 'users', label: 'People to Follow', icon: Users },
    { id: 'podcasts', label: 'Podcasts', icon: Radio },
  ];
  
  const [activeType, setActiveType] = useState('books');
  
  useEffect(() => {
    if (user) {
      generateRecommendations(activeType);
    }
  }, [user, activeType]);
  
  const generateRecommendations = async (type: string) => {
    setLoading(true);
    setRecommendations([]);
    
    try {
      // Track this recommendation request
      trackEvent('feature_use', {
        feature: 'ai_recommendations',
        recommendationType: type
      });
      
      // Call the AI to generate personalized recommendations
      const response = await supabase.functions.invoke('generate-with-ai', {
        body: { 
          prompt: `Generate personalized ${type} recommendations for a user interested in academic knowledge, research and science. Provide the results as a JSON array with objects having id, type, title, description, imageUrl (placeholder URL), author (if applicable), url (placeholder), relevanceScore (0-1), and tags (array of strings). Make them diverse and interesting. Include at least 5 recommendations.` 
        }
      });
      
      const responseData = response.data as { generatedText: string } | undefined;
      
      if (responseData?.generatedText) {
        // Extract JSON from the response text
        const jsonMatch = responseData.generatedText.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          try {
            const recommendations = JSON.parse(jsonMatch[0]) as Recommendation[];
            setRecommendations(recommendations);
          } catch (jsonError) {
            console.error('Error parsing JSON from AI response:', jsonError);
            toast({
              title: "Error Processing Recommendations",
              description: "We couldn't process the recommendations data. Please try again.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Invalid Recommendation Format",
            description: "The AI returned recommendations in an unexpected format. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Recommendation Generation Failed",
        description: "We couldn't generate personalized recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    generateRecommendations(activeType);
  };
  
  const getIconForType = (type: string) => {
    const typeConfig = recommendationTypes.find(t => t.id === type);
    const IconComponent = typeConfig?.icon || Lightbulb;
    return <IconComponent size={20} className="text-primary" />;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb size={20} className="text-primary" />
          AI Personalized Recommendations
        </CardTitle>
        <div className="flex overflow-x-auto gap-2 py-2">
          {recommendationTypes.map((type) => (
            <Button
              key={type.id}
              variant={activeType === type.id ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setActiveType(type.id)}
            >
              <type.icon size={16} />
              {type.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">
                Generating personalized {activeType} recommendations...
              </p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
                <Loader2 size={14} />
                Refresh Recommendations
              </Button>
            </div>
            
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {rec.type === 'user' ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={rec.imageUrl} alt={rec.title} />
                          <AvatarFallback>{rec.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                          {getIconForType(activeType)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{rec.title}</h3>
                        {rec.relevanceScore && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {Math.round(rec.relevanceScore * 100)}% match
                          </Badge>
                        )}
                      </div>
                      
                      {rec.author && (
                        <p className="text-sm text-muted-foreground">{rec.author}</p>
                      )}
                      
                      <p className="text-sm mt-2">{rec.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {rec.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {rec.url && (
                        <div className="mt-3">
                          <Button variant="link" className="p-0 h-auto" asChild>
                            <a href={rec.url} target="_blank" rel="noopener noreferrer">
                              View Details
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-8 text-center">
            <div>
              <Lightbulb size={40} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                We'll generate personalized {activeType} recommendations based on your interests
              </p>
              <Button onClick={handleRefresh} className="mt-4">Get Recommendations</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
