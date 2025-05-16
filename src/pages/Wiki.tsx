
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { WikiHeader } from "@/components/wiki/WikiHeader";
import { CategorySidebar } from "@/components/wiki/CategorySidebar";
import { WikiSearchBar } from "@/components/wiki/WikiSearchBar";
import { ArticleList } from "@/components/wiki/ArticleList";
import { CreateArticleDialog } from "@/components/wiki/CreateArticleDialog";
import { getCategoryIcon, filterArticles } from "@/components/wiki/WikiUtils";
import { WikiArticle } from "@/components/wiki/types";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layouts/PageLayout";

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

  // Fetch wiki articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('wiki_articles')
          .select(`
            id,
            title,
            description,
            category,
            content,
            contributors,
            views,
            last_updated,
            profiles(name, avatar_url)
          `)
          .order('last_updated', { ascending: false });
        
        // Apply category filter if selected
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        // Apply pagination
        const pageSize = 9;
        query = query.range(page * pageSize, (page + 1) * pageSize - 1);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          const formattedArticles: WikiArticle[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            content: item.content,
            lastUpdated: formatLastUpdated(item.last_updated),
            contributors: item.contributors || 1,
            views: item.views || 0,
            author: item.profiles?.name || 'Unknown'
          }));
          
          setArticles(prev => page === 0 ? formattedArticles : [...prev, ...formattedArticles]);
          setHasMore(data.length === pageSize);
        }
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
    
    fetchArticles();
  }, [selectedCategory, page, toast]);

  // Format the last updated date
  const formatLastUpdated = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

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

  return (
    <PageLayout>
      <div className="container px-4 lg:px-8 mx-auto py-8 max-w-7xl">
        <WikiHeader onCreateArticle={() => setIsCreateDialogOpen(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1 w-full">
            <CategorySidebar 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 w-full">
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
