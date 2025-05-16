
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, ArrowLeft, Clock, Eye, UserCircle, Calendar, MessagesSquare, Pencil, Heart } from "lucide-react";
import { getCategoryIcon } from "@/components/wiki/WikiUtils";
import { WikiArticle } from "@/components/wiki/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const WikiArticlePage = () => {
  const { articleId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch the article
        const { data, error } = await supabase
          .from('wiki_articles')
          .select(`
            *,
            profiles(name, avatar_url)
          `)
          .eq('id', articleId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const formattedArticle: WikiArticle = {
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            content: data.content,
            lastUpdated: formatLastUpdated(data.last_updated),
            contributors: data.contributors || 1,
            views: data.views || 0,
            author: data.profiles?.name || 'Unknown'
          };
          
          setArticle(formattedArticle);
          
          // Increment view count
          await supabase
            .from('wiki_articles')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', articleId);
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
  }, [articleId, toast]);

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

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container px-4 lg:px-8 mx-auto py-8 max-w-7xl">
          <Button variant="ghost" className="mb-6">
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
        <div className="container px-4 lg:px-8 mx-auto py-8 max-w-7xl">
          <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-2" /> Back to Wiki
          </Button>
          
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle size={48} className="text-destructive mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Article Not Found</CardTitle>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => window.history.back()}>
                Return to Wiki
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 lg:px-8 mx-auto py-8 max-w-7xl">
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft size={16} className="mr-2" /> Back to Wiki
        </Button>
        
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {getCategoryIcon(article.category)}
                  </div>
                  <span className="text-sm text-muted-foreground">{article.category}</span>
                </div>
                <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
                <p className="text-muted-foreground">{article.description}</p>
              </div>
              
              {user && (
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Pencil size={14} />
                  <span>Edit Article</span>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <UserCircle size={16} />
                <span>Author: {article.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>Last updated: {article.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={16} />
                <span>{article.views} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCircle size={16} />
                <span>{article.contributors} contributors</span>
              </div>
            </div>
            
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content || ''}
              </ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{article.author?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{article.author || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">Contributor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <Heart size={14} />
                  <span>Like</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <MessagesSquare size={14} />
                  <span>Discuss</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default WikiArticlePage;
