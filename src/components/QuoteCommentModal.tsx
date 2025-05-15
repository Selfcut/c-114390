
import { useState, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";

interface QuoteCommentModalProps {
  quoteId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user?: {
    name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export const QuoteCommentModal = ({ 
  quoteId, 
  isOpen, 
  onClose,
  onCommentAdded 
}: QuoteCommentModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        // First fetch all comments for this quote
        const { data: commentsData, error } = await supabase
          .from('quote_comments')
          .select('*')
          .eq('quote_id', quoteId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Then fetch user data for each comment separately
        if (commentsData) {
          const commentsWithUsers = await Promise.all(
            commentsData.map(async (comment) => {
              // Get user data for each comment
              const { data: userData } = await supabase
                .from('profiles')
                .select('name, username, avatar_url')
                .eq('id', comment.user_id)
                .single();
                
              return {
                ...comment,
                user: userData || { name: 'Unknown User', username: 'unknown' }
              } as Comment;
            })
          );
          
          setComments(commentsWithUsers);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        toast({
          title: "Failed to load comments",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
    
    // Set up real-time subscription for new comments
    const channel = supabase
      .channel('public:quote_comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'quote_comments',
        filter: `quote_id=eq.${quoteId}`
      }, async (payload) => {
        // Fetch the user details for the new comment
        const { data: userData } = await supabase
          .from('profiles')
          .select('username, name, avatar_url')
          .eq('id', payload.new.user_id)
          .single();
          
        // Add the new comment to the state
        const newComment = {
          ...payload.new,
          user: userData || {}
        } as Comment;
        
        setComments(prev => [newComment, ...prev]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [quoteId, isOpen]);
  
  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Comment is empty",
        description: "Please write something before submitting",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Add comment to database
      const { error } = await supabase
        .from('quote_comments')
        .insert({
          quote_id: quoteId,
          user_id: user.id,
          content: newComment.trim()
        });
        
      if (error) throw error;
      
      // Update quote comment count using the specific function
      // Fix: Use the from method to call the RPC instead of direct rpc method
      const { error: updateError } = await supabase
        .from('rpc')
        .select('*')
        .eq('function_name', 'increment_quote_comments')
        .eq('quote_id', quoteId)
        .single();
      
      if (updateError) throw updateError;
      
      // Add activity record
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          event_type: 'comment',
          metadata: { quote_id: quoteId }
        });
      
      setNewComment("");
      
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      toast({
        title: "Comment added successfully"
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        title: "Failed to post comment",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare size={20} />
            Comments
          </h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/30"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {isAuthenticated ? (
            <div className="flex gap-3 mb-6">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${user?.username || user?.id}`} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="resize-none w-full mb-2"
                  disabled={isSubmitting}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    <Send size={14} className="mr-2" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm mb-2">You need to be logged in to comment</p>
              <Button size="sm" variant="outline" onClick={() => window.location.href = "/auth"}>
                Log in
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons for comments
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${comment.user?.username || comment.user_id}`} />
                    <AvatarFallback>
                      {(comment.user?.name?.[0] || comment.user?.username?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-medium text-sm">
                        {comment.user?.name || comment.user?.username || "Anonymous"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={36} className="mx-auto text-muted-foreground opacity-20 mb-2" />
                <p className="text-muted-foreground">No comments yet</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to comment on this quote</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
