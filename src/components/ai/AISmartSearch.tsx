
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, BookOpen, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSearchTracking } from "@/lib/analytics";

interface SearchResult {
  title: string;
  description: string;
  url?: string;
  relevance?: number;
  source?: string;
}

export function AISmartSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();
  const { trackSearch } = useSearchTracking();
  
  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResults([]);
    
    try {
      // Track search event
      trackSearch(query, 0, { source: 'ai_smart_search' });
      
      // Call the AI to perform smart search
      const response = await supabase.functions.invoke('generate-with-ai', {
        body: { 
          prompt: `I need intelligent search results for the query: "${query}". Please provide results in JSON format with title, description, and optionally url, relevance, and source fields. Make the results academic in nature and focused on providing valuable information. Format as valid JSON array.` 
        }
      });
      
      const responseData = response.data as { generatedText: string } | undefined;
      
      if (responseData?.generatedText) {
        // Extract JSON from the response text
        const jsonMatch = responseData.generatedText.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          try {
            const searchResults = JSON.parse(jsonMatch[0]) as SearchResult[];
            setResults(searchResults);
            trackSearch(query, searchResults.length, { source: 'ai_smart_search', success: true });
          } catch (jsonError) {
            console.error('Error parsing JSON from AI response:', jsonError);
            createFallbackResults(responseData.generatedText);
          }
        } else {
          createFallbackResults(responseData.generatedText);
        }
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error performing smart search:', error);
      toast({
        title: "Search Failed",
        description: "We couldn't complete your search. Please try again.",
        variant: "destructive"
      });
      trackSearch(query, 0, { source: 'ai_smart_search', error: error.message, success: false });
    } finally {
      setLoading(false);
    }
  };
  
  const createFallbackResults = (text: string) => {
    // If JSON parsing fails, create a single result from the response
    const fallbackResult: SearchResult = {
      title: `Results for "${query}"`,
      description: text,
      source: "AI Assistant"
    };
    setResults([fallbackResult]);
    trackSearch(query, 1, { source: 'ai_smart_search', fallback: true });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={20} className="text-primary" />
          AI-Enhanced Smart Search
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for academic concepts, theories, papers..."
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="font-medium text-lg">Search Results</h3>
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-base">{result.title}</h4>
                      {result.source && (
                        <p className="text-xs text-muted-foreground mb-2">Source: {result.source}</p>
                      )}
                    </div>
                    {result.relevance && (
                      <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {Math.round(result.relevance * 100)}% relevant
                      </div>
                    )}
                  </div>
                  <p className="text-sm mt-2">{result.description}</p>
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
                    >
                      View Resource <ExternalLink size={14} />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">
                Searching for academic insights related to "{query}"...
              </p>
            </div>
          </div>
        )}
        
        {!loading && query && results.length === 0 && (
          <div className="flex justify-center items-center p-8 text-center">
            <div>
              <BookOpen size={40} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Enter a search term to find academic resources and information
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
