import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, ArrowLeft, Calendar, Heart, MessagesSquare, Pencil, UserCircle, Eye, Bookmark } from "lucide-react";
import { getCategoryIcon, formatDate } from "@/components/wiki/WikiUtils";
import { WikiArticle } from "@/components/wiki/types";
import { fetchWikiArticleById } from "@/utils/wikiUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditWikiArticleDialog } from "@/components/wiki/EditWikiArticleDialog";
import { useWikiContentInteractions } from "@/hooks/content/useWikiContentInteractions";

const WikiArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Use the wiki interactions hook
  const { 
    likedItems, 
    bookmarkedItems, 
    handleLike, 
    handleBookmark,
    checkInteractions,
    getLoadingState
  } = useWikiContentInteractions(user?.id || null);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      try {
        setIsLoading(true);
        
        const { article, error } = await fetchWikiArticleById(articleId);
        
        if (error) throw new Error(error.toString());
        
        if (article) {
          setArticle(article);
          if (user?.id) {
            checkInteractions(article.id);
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
  }, [articleId, toast, user?.id, checkInteractions]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUpdateArticle = (updatedArticle: WikiArticle) => {
    setArticle(updatedArticle);
    setIsEditDialogOpen(false);
    toast({
      title: "Article Updated",
      description: "The article has been updated successfully",
    });
  };
  
  // Helper to handle like button click
  const onLikeClick = () => {
    if (article) {
      handleLike(article.id);
    }
  };
  
  // Helper to handle bookmark button click
  const onBookmarkClick = () => {
    if (article) {
      handleBookmark(article.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" /> Back to Wiki
          </Button>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-2/3" />
              
              <div className="mt-8 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" /> Back to Wiki
          </Button>
          
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle size={48} className="text-destructive mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Article Not Found</CardTitle>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBack}>
                Return to Wiki
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Format the date safely
  const formattedDate = article.last_updated instanceof Date 
    ? formatDate(article.last_updated) 
    : formatDate(new Date(article.last_updated));

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" /> Back to Wiki
        </Button>
        
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {getCategoryIcon(article?.category || '')}
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">{article?.category}</span>
                </div>
                <CardTitle className="text-3xl mb-2">{article?.title}</CardTitle>
                <p className="text-muted-foreground">{article?.description}</p>
              </div>
              
              {user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil size={14} />
                  <span>Edit Article</span>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 px-6 md:px-8">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <UserCircle size={16} />
                <span>Author: {article?.author_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>Last updated: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={16} />
                <span>{article?.views} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCircle size={16} />
                <span>{article?.contributors} contributors</span>
              </div>
            </div>
            
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article?.content || ''}
              </ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{article?.author_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{article?.author_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">Contributor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {article && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onLikeClick} 
                      disabled={!user || getLoadingState(article.id).isLikeLoading}
                      className={`flex items-center gap-1.5 ${likedItems[article.id] ? 'text-primary' : ''}`}
                    >
                      <Heart size={14} className={likedItems[article.id] ? 'fill-primary' : ''} />
                      <span>Like</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onBookmarkClick}
                      disabled={!user || getLoadingState(article.id).isBookmarkLoading}
                      className={`flex items-center gap-1.5 ${bookmarkedItems[article.id] ? 'text-primary' : ''}`}
                    >
                      <Bookmark size={14} className={bookmarkedItems[article.id] ? 'fill-primary' : ''} />
                      <span>Bookmark</span>
                    </Button>
                  </>
                )}
                
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <MessagesSquare size={14} />
                  <span>Discuss</span>
                </Button>
              </div>
            </div>
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
