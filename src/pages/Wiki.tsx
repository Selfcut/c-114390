
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { WikiSearchBar } from "@/components/wiki/WikiSearchBar";
import { ArticleList } from "@/components/wiki/ArticleList";
import { CreateArticleDialog } from "@/components/wiki/CreateArticleDialog";
import { getCategoryIcon, filterArticles } from "@/components/wiki/WikiUtils";
import { WikiArticle } from "@/components/wiki/types";
import { fetchWikiArticles } from "@/utils/wikiUtils";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Database, Loader2 } from "lucide-react";
import { CategorySidebar } from "@/components/wiki/CategorySidebar";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Input } from "@/components/ui/input";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Wiki = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [semanticQuery, setSemanticQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSemanticSearchActive, setIsSemanticSearchActive] = useState(false);

  // Use semantic search hook for wiki articles
  const { 
    results: semanticResults, 
    isLoading: isSemanticSearchLoading,
    error: semanticSearchError,
    performSearch: doSemanticSearch
  } = useSemanticSearch<WikiArticle>({ contentType: 'wiki' });

  // Fetch wiki articles
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      
      try {
        const { articles: fetchedArticles, hasMore: moreAvailable, error } = await fetchWikiArticles({
          category: selectedCategory || undefined,
          page,
          pageSize: 9
        });
        
        if (error) throw error;
        
        setArticles(prev => page === 0 ? fetchedArticles : [...prev, ...fetchedArticles]);
        setHasMore(moreAvailable);
      } catch (err: any) {
        console.error('Error fetching wiki articles:', err);
        toast({
          title: "Error",
          description: "Failed to load wiki articles",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isSemanticSearchActive) {
      loadArticles();
    }
  }, [selectedCategory, page, toast, isSemanticSearchActive]);

  // Handle semantic search
  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (semanticQuery.trim()) {
      setIsSemanticSearchActive(true);
      await doSemanticSearch(semanticQuery);
    }
  };

  const handleClearSemanticSearch = () => {
    setIsSemanticSearchActive(false);
    setSemanticQuery("");
  };

  // Filter articles based on search
  const filteredArticles = isSemanticSearchActive 
    ? semanticResults 
    : filterArticles(articles, searchQuery, selectedCategory);

  // Handle article submission
  const handleArticleSubmit = async (newArticle: WikiArticle) => {
    setArticles(prev => [newArticle, ...prev]);
    
    // Generate embeddings for the new article
    try {
      await supabase.functions.invoke('generate-embeddings', {
        body: { contentType: 'wiki', contentId: newArticle.id }
      });
    } catch (err) {
      console.error('Error generating embeddings for new article:', err);
      // Non-critical error, don't show to user
    }
  };

  const loadMoreArticles = () => {
    setPage(prev => prev + 1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setIsSemanticSearchActive(false);
    setSemanticQuery("");
  };
  
  const handleCreateArticle = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create new wiki articles",
        variant: "destructive"
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen size={28} className="text-primary" />
            Knowledge Wiki
          </h1>
          <Button 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto"
            onClick={handleCreateArticle}
          >
            <Plus size={18} />
            <span>New Article</span>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Semantic Search</CardTitle>
            <CardDescription>
              Ask questions in natural language to find wiki articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSemanticSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Ask a question or describe what you're looking for..."
                  value={semanticQuery}
                  onChange={(e) => setSemanticQuery(e.target.value)}
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
                Search
              </Button>
              {isSemanticSearchActive && (
                <Button 
                  variant="outline" 
                  onClick={handleClearSemanticSearch}
                  disabled={isSemanticSearchLoading}
                >
                  Clear
                </Button>
              )}
            </form>
            {semanticSearchError && (
              <p className="text-sm text-destructive mt-2">{semanticSearchError}</p>
            )}
            {isSemanticSearchActive && semanticResults.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {semanticResults.length} articles using semantic search
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <CategorySidebar 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              disabled={isSemanticSearchActive}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <WikiSearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              disabled={isSemanticSearchActive}
            />

            {isSemanticSearchActive && semanticResults.length === 0 && !isSemanticSearchLoading && (
              <Alert className="mb-6">
                <AlertTitle>No semantic search results</AlertTitle>
                <AlertDescription>
                  Try a different query or check if articles on this topic exist in our wiki.
                </AlertDescription>
              </Alert>
            )}

            <ArticleList 
              filteredArticles={filteredArticles}
              getCategoryIcon={getCategoryIcon}
              isLoading={isSemanticSearchActive ? isSemanticSearchLoading : isLoading}
              loadMoreArticles={loadMoreArticles}
              resetFilters={resetFilters}
            />
          </div>
        </div>

        {/* Create Article Dialog */}
        <CreateArticleDialog 
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={handleArticleSubmit}
        />
      </div>
    </PageLayout>
  );
};

export default Wiki;
