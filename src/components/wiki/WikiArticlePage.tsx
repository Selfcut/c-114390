
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WikiArticle } from "@/components/wiki/types";
import { fetchWikiArticleById } from "@/utils/wikiUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { EditWikiArticleDialog } from "@/components/wiki/EditWikiArticleDialog";
import { useContentLikes } from "@/hooks/content/useContentLikes";
import { WikiArticleLoading } from "./WikiArticleLoading";
import { WikiArticleError } from "./WikiArticleError";
import { WikiArticleHeader } from "./WikiArticleHeader";
import { WikiArticleMeta } from "./WikiArticleMeta";
import { WikiArticleContent } from "./WikiArticleContent";
import { WikiArticleActions } from "./WikiArticleActions";

const WikiArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Use content likes hook for wiki articles
  const { toggleLike, checkUserLike, isLoading: isProcessing } = useContentLikes({
    contentType: 'wiki'
  });

  const isAuthenticated = !!user;

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError("Article ID is missing");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { article, error } = await fetchWikiArticleById(articleId);
        
        if (error) throw new Error(error.toString());
        
        if (article) {
          setArticle(article);
          
          // Check if the user has liked this article
          if (isAuthenticated) {
            const hasLiked = await checkUserLike(article.id);
            setIsLiked(hasLiked);
          }
        } else {
          setError("Article not found");
        }
      } catch (err: any) {
        console.error('Error fetching wiki article:', err);
        setError(err.message || "Failed to load article");
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [articleId, toast, retryCount, checkUserLike, isAuthenticated]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  const handleUpdateArticle = (updatedArticle: WikiArticle) => {
    setArticle(updatedArticle);
    setIsEditDialogOpen(false);
    toast({
      title: "Article Updated",
      description: "The article has been updated successfully",
    });
  };

  const handleLikeToggle = async () => {
    if (!articleId || !article) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like articles",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await toggleLike(article.id);
      
      // Update local state
      setIsLiked(prev => !prev);
      setArticle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.likes !== undefined ? (isLiked ? prev.likes - 1 : prev.likes + 1) : (isLiked ? 0 : 1)
        };
      });
    } catch (error) {
      console.error('Exception in handleLikeToggle:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <WikiArticleLoading onBack={handleBack} />
      </PageLayout>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <PageLayout>
        <WikiArticleError 
          error={error} 
          onBack={handleBack} 
          onRetry={handleRetry} 
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" /> Back to Wiki
        </Button>
        
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-6">
            <WikiArticleHeader
              title={article.title}
              description={article.description}
              category={article.category}
              isUserAuthenticated={!!user}
              onEditClick={() => setIsEditDialogOpen(true)}
            />
          </CardHeader>
          
          <CardContent className="pt-6 px-6 md:px-8">
            <WikiArticleMeta
              authorName={article.author_name}
              lastUpdated={article.last_updated}
              views={article.views}
              contributors={article.contributors}
              likes={article.likes}
              isLiked={isLiked}
            />
            
            <WikiArticleContent content={article.content} />
            
            <WikiArticleActions
              authorName={article.author_name}
              isLiked={isLiked}
              isProcessingLike={isProcessing}
              onLikeToggle={handleLikeToggle}
            />
          </CardContent>
        </Card>

        {/* Edit Article Dialog */}
        {article && (
          <EditWikiArticleDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            article={article}
            onSuccess={handleUpdateArticle}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default WikiArticlePage;
