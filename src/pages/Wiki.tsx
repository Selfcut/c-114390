
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { WikiHeader } from "@/components/wiki/WikiHeader";
import { CategorySidebar } from "@/components/wiki/CategorySidebar";
import { WikiSearchBar } from "@/components/wiki/WikiSearchBar";
import { ArticleList } from "@/components/wiki/ArticleList";
import { CreateArticleDialog } from "@/components/wiki/CreateArticleDialog";
import { getCategoryIcon, filterArticles } from "@/components/wiki/WikiUtils";
import { WikiArticle } from "@/components/wiki/types";

const Wiki = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial mock wiki articles
  const [articles, setArticles] = useState<WikiArticle[]>([
    {
      id: "1",
      title: "Quantum Mechanics: An Introduction",
      description: "A comprehensive introduction to the fundamental principles of quantum mechanics.",
      category: "physics",
      lastUpdated: "2 days ago",
      contributors: 5,
      views: 423
    },
    {
      id: "2",
      title: "The Hard Problem of Consciousness",
      description: "An exploration of the philosophical challenges in explaining subjective experience.",
      category: "consciousness",
      lastUpdated: "1 week ago",
      contributors: 3,
      views: 287
    },
    {
      id: "3",
      title: "Gödel's Incompleteness Theorems",
      description: "Understanding the limits of formal mathematical systems and their philosophical implications.",
      category: "mathematics",
      lastUpdated: "3 days ago",
      contributors: 2,
      views: 156
    },
    {
      id: "4",
      title: "Feedback Loops in Complex Systems",
      description: "Analyzing positive and negative feedback mechanisms in systems theory.",
      category: "systems",
      lastUpdated: "5 days ago",
      contributors: 4,
      views: 198
    },
    {
      id: "5",
      title: "Mind-Body Problem",
      description: "Historical perspectives and modern approaches to the relationship between mind and matter.",
      category: "philosophy",
      lastUpdated: "2 weeks ago",
      contributors: 7,
      views: 312
    }
  ]);

  // Filter articles based on search and category
  const filteredArticles = filterArticles(articles, searchQuery, selectedCategory);

  const handleArticleSubmit = (newArticleData: Omit<WikiArticle, "id" | "lastUpdated" | "contributors" | "views">) => {
    if (!newArticleData.title || !newArticleData.description || !newArticleData.category || !newArticleData.content) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newWikiArticle: WikiArticle = {
        id: `article-${Date.now()}`,
        title: newArticleData.title,
        description: newArticleData.description,
        category: newArticleData.category,
        content: newArticleData.content,
        lastUpdated: "Just now",
        contributors: 1,
        views: 0
      };

      setArticles(prevArticles => [newWikiArticle, ...prevArticles]);
      setIsCreateDialogOpen(false);
      setIsSubmitting(false);

      toast({
        title: "Article Created",
        description: "Your new wiki article has been published successfully!",
      });
    }, 1000);
  };

  const loadMoreArticles = () => {
    setIsLoading(true);
    
    // Simulate loading more articles
    setTimeout(() => {
      const additionalArticles: WikiArticle[] = [
        {
          id: `article-${Date.now()}-1`,
          title: "Emergence in Complex Systems",
          description: "How complex behaviors emerge from simple rules and interactions.",
          category: "systems",
          lastUpdated: "1 day ago",
          contributors: 3,
          views: 142
        },
        {
          id: `article-${Date.now()}-2`,
          title: "Quantum Entanglement",
          description: "Understanding the phenomenon of quantum entanglement and its implications.",
          category: "physics",
          lastUpdated: "3 days ago",
          contributors: 4,
          views: 215
        }
      ];

      setArticles(prevArticles => [...prevArticles, ...additionalArticles]);
      setIsLoading(false);
    }, 1000);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
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
        onSubmit={handleArticleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Wiki;
