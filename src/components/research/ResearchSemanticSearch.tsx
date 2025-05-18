
import React from 'react';
import { Search, Loader2, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResearchSemanticSearchProps {
  semanticQuery: string;
  onSemanticQueryChange: (query: string) => void;
  isSemanticSearchLoading: boolean;
  isSemanticSearchActive: boolean;
  semanticSearchError: string | null;
  semanticResultsCount: number;
  onSemanticSearch: (e: React.FormEvent) => void;
  onClearSemanticSearch: () => void;
}

export const ResearchSemanticSearch: React.FC<ResearchSemanticSearchProps> = ({
  semanticQuery,
  onSemanticQueryChange,
  isSemanticSearchLoading,
  isSemanticSearchActive,
  semanticSearchError,
  semanticResultsCount,
  onSemanticSearch,
  onClearSemanticSearch
}) => {
  return (
    <>
      <div className="mb-6">
        <form onSubmit={onSemanticSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Ask a question or describe what you're looking for..."
              value={semanticQuery}
              onChange={(e) => onSemanticQueryChange(e.target.value)}
              className="pl-10"
              disabled={isSemanticSearchLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!semanticQuery.trim() || isSemanticSearchLoading}
          >
            {isSemanticSearchLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Semantic Search
          </Button>
          {isSemanticSearchActive && (
            <Button 
              variant="outline" 
              onClick={onClearSemanticSearch}
              disabled={isSemanticSearchLoading}
            >
              Clear
            </Button>
          )}
        </form>
        {semanticSearchError && (
          <p className="text-sm text-destructive mt-1">{semanticSearchError}</p>
        )}
        {isSemanticSearchActive && semanticResultsCount > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            Found {semanticResultsCount} papers using semantic search
          </p>
        )}
      </div>
      
      <Alert className="mb-4">
        <Database className="h-4 w-4" />
        <AlertTitle>Semantic Search Available</AlertTitle>
        <AlertDescription>
          Try asking questions like "papers about large language models" or "research on explainable AI" to find semantically related content.
        </AlertDescription>
      </Alert>
    </>
  );
};
