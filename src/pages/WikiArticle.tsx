
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { EditWikiArticleDialog } from '@/components/wiki/EditWikiArticleDialog';
import { WikiArticle } from '@/components/wiki/types';
import { fetchWikiArticleById } from '@/utils/wikiUtils';
import { formatDate } from '@/components/wiki/WikiUtils';
import { ArrowLeft, Edit, Clock, Eye, BookOpen, Tag, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const WikiArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Load article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { article, error } = await fetchWikiArticleById(id);
        
        if (error) throw error;
        
        if (article) {
          setArticle(article);
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
  }, [id, toast]);

  const handleEditArticle = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to edit articles",
        variant: "destructive"
      });
      return;
    }
    
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateArticle = (updatedArticle: WikiArticle) => {
    setArticle(updatedArticle);
    setIsEditDialogOpen(false);
    toast({
      title: "Article Updated",
      description: "The article has been updated successfully",
    });
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/wiki')}
        >
          <ArrowLeft size={16} />
          Back to Wiki
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : article ? (
          <>
            {article.image_url && (
              <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <Badge className="mb-2">{article.category}</Badge>
                  <h1 className="text-3xl font-bold text-white mb-2">{article.title}</h1>
                </div>
              </div>
            )}
            
            {!article.image_url && (
              <div className="mb-6">
                <Badge className="mb-2">{article.category}</Badge>
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              </div>
            )}
            
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_name}`} 
                    alt={article.author_name} 
                  />
                  <AvatarFallback>{article.author_name?.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{article.author_name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    Published on {formatDate(article.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  Updated {formatDate(article.last_updated)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {article.views} views
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {article.contributors} contributors
                </span>
              </div>
            </div>
            
            <div className="flex justify-end mb-6">
              <Button 
                onClick={handleEditArticle}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Article
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content || ''}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags?.map((tag, i) => (
                <Badge key={i} variant="outline" className="flex items-center gap-1">
                  <Tag size={12} />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Edit Article Dialog */}
            {article && (
              <EditWikiArticleDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                article={article}
                onSuccess={handleUpdateArticle}
              />
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Article not found or has been removed.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/wiki')}
              >
                Back to Wiki
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default WikiArticlePage;
