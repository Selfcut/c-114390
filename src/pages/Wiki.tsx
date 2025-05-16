
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { WikiSearchBar } from "@/components/wiki/WikiSearchBar";
import { ArticleList } from "@/components/wiki/ArticleList";
import { CreateArticleDialog } from "@/components/wiki/CreateArticleDialog";
import { getCategoryIcon, filterArticles } from "@/components/wiki/WikiUtils";
import { WikiArticle } from "@/components/wiki/types";
import { fetchWikiArticles } from "@/utils/wikiUtils";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { CategorySidebar } from "@/components/wiki/CategorySidebar";

const Wiki = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
    
    loadArticles();
  }, [selectedCategory, page, toast]);

  // Filter articles based on search
  const filteredArticles = filterArticles(articles, searchQuery, selectedCategory);

  // Handle article submission
  const handleArticleSubmit = (newArticle: WikiArticle) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const loadMoreArticles = () => {
    setPage(prev => prev + 1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
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
      <div className="container mx-auto py-8 px-4">
        {/* Wiki Header - Combined into one header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 stagger-fade animate-in">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <CategorySidebar 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <WikiSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <ArticleList 
              filteredArticles={filteredArticles}
              getCategoryIcon={getCategoryIcon}
              isLoading={isLoading}
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
