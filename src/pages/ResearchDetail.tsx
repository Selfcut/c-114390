import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Eye, ThumbsUp, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useResearchActions } from '@/hooks/useResearchActions';
import { ResearchPaper } from '@/lib/supabase-types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ResearchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { incrementViewCount, toggleLike } = useResearchActions();
  
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch the paper data
  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Get the paper details
        const { data: paper, error } = await supabase
          .from('research_papers')
          .select('*')
          .eq('id', id)
          .single() as { data: ResearchPaper | null, error: any };
        
        if (error) {
          throw error;
        }
        
        if (!paper) {
          toast({
            title: "Not found",
            description: "The research paper you're looking for doesn't exist",
            variant: "destructive"
          });
          navigate('/research');
          return;
        }
        
        setPaper(paper);
        setIsOwner(user?.id === paper.user_id);
        
        // Increment view count
        await incrementViewCount(id);
        
        // Check if user has liked this paper
        if (user) {
          const { data: likeData, error: likeError } = await supabase
            .from('content_likes')
            .select('*')
            .eq('content_id', id)
            .eq('user_id', user.id)
            .eq('content_type', 'research')
            .maybeSingle() as { data: any, error: any };
          
          if (!likeError && likeData) {
            setIsLiked(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching research paper:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load research paper",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaper();
  }, [id, navigate, toast, user, incrementViewCount]);
  
  const handleBack = () => {
    navigate('/research');
  };
  
  const handleLike = async () => {
    if (!paper || !user) return;
    
    const result = await toggleLike(paper.id);
    setIsLiked(result);
    
    // Update the paper's like count locally
    setPaper(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        likes: isLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
      };
    });
  };
  
  const handleEdit = () => {
    if (!paper) return;
    // This would navigate to an edit page or open an edit dialog
    toast({
      title: "Edit research",
      description: "This feature will be implemented soon.",
    });
  };
  
  const handleDelete = async () => {
    if (!paper || !user) return;
    
    try {
      const { error } = await supabase
        .from('research_papers')
        .delete()
        .eq('id', paper.id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Research paper deleted",
        description: "Your paper has been removed successfully"
      });
      
      navigate('/research');
    } catch (error: any) {
      console.error('Error deleting research paper:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete research paper",
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-14 w-3/4 bg-muted rounded"></div>
            <div className="h-6 w-40 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!paper) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Research
          </Button>
          
          <div className="flex flex-col items-center justify-center text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Research Paper Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The research paper you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleBack}>Return to Research</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Research
        </Button>
        
        <Card>
          {paper.image_url && (
            <div className="w-full h-64 overflow-hidden">
              <img 
                src={paper.image_url} 
                alt={paper.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{paper.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold">{paper.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(paper.created_at), 'MMMM d, yyyy')}
              </div>
              
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {paper.views} views
              </div>
              
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {paper.likes} likes
              </div>
              
              <div>By {paper.author}</div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium text-lg">{paper.summary}</p>
            </div>
            
            {paper.content ? (
              <div className="prose max-w-none dark:prose-invert">
                {paper.content}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Full content not available for this research paper.</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-wrap gap-4 justify-between border-t p-6">
            <Button
              variant={isLiked ? "default" : "outline"}
              onClick={handleLike}
              disabled={!user}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {isLiked ? "Liked" : "Like"}
            </Button>
            
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your 
                research paper and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default ResearchDetail;
