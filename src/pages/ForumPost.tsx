import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageSEO } from '@/components/layouts/PageSEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useForumPost } from '@/hooks/forum/useForumPost';
import { useForumActions, ForumDiscussion } from '@/hooks/forum/useForumActions';
import { formatTimeAgo } from '@/utils/formatters';
import { UserProfile } from '@/types/user';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { UpvoteButton } from '@/components/forum/UpvoteButton';
import { useToast } from '@/hooks/use-toast';

// Create a type adapter between the hook's Comment type and our local Comment type
interface ForumComment {
  id: string;
  content: string; // Maps to 'comment' in our local type
  author: string;  // Maps to 'author_name' in our local type
  createdAt: Date; // Maps to 'created_at' in our local type (but as Date)
  authorAvatar?: string;
  isAuthor: boolean;
}

// Local Comment interface for the components in this file
interface Comment {
  id: string;
  author_name: string;
  created_at: string;
  comment: string;
}

// Ensure ForumPost type includes user_id needed by ForumDiscussion
interface ForumPost {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  views: number;
  comments: number;
  authorId: string; // This will be used as user_id for ForumDiscussion compatibility
  createdAt: Date | string;
  // Add other properties as needed
}

// Function to convert hook Comment type to our local Comment type
function adaptComments(comments: any[]): Comment[] {
  return comments.map(comment => ({
    id: comment.id,
    author_name: comment.author,
    created_at: comment.createdAt?.toISOString() || new Date().toISOString(), // Ensure date exists
    comment: comment.content
  }));
}

// Placeholder components - in a real project, these would be in separate files
interface ForumPostSkeletonProps {}
const ForumSkeleton: React.FC<ForumPostSkeletonProps> = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-10 bg-secondary rounded w-3/4"></div>
    <div className="h-6 bg-secondary rounded w-1/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-secondary rounded"></div>
      <div className="h-4 bg-secondary rounded"></div>
      <div className="h-4 bg-secondary rounded w-5/6"></div>
    </div>
  </div>
);

interface ForumPostDetailsProps {
  discussion: any;
}
const ForumPostDetails: React.FC<ForumPostDetailsProps> = ({ discussion }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">{discussion.title}</h1>
    <div className="flex items-center text-sm text-muted-foreground">
      <span>Posted by {discussion.author || 'Anonymous'}</span>
    </div>
    <div className="prose max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: discussion.content }} />
    </div>
  </div>
);

interface ForumPostStatsProps {
  views: number;
  comments: number;
  upvotes: number;
  createdAt: string | Date;
  formatTimeAgo: (date: string) => string;
  onUpvote: () => Promise<void>;
  hasUpvoted?: boolean;
  isAuthenticated: boolean;
  onShare: () => void;
}
const ForumPostStats: React.FC<ForumPostStatsProps> = ({
  views,
  comments,
  upvotes,
  createdAt,
  formatTimeAgo,
  onUpvote,
  hasUpvoted = false,
  isAuthenticated,
  onShare
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b mt-6 mb-8">
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <UpvoteButton count={upvotes} onUpvote={onUpvote} hasUpvoted={hasUpvoted} />
      <div>{comments} comments</div>
      <div>{views} views</div>
      <div>{formatTimeAgo(typeof createdAt === 'string' ? createdAt : createdAt?.toISOString() || new Date().toISOString())}</div>
    </div>
    
    <Button variant="outline" size="sm" onClick={onShare}>
      <Share size={16} className="mr-2" />
      Share
    </Button>
  </div>
);

interface AddCommentProps {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting: boolean;
  user: UserProfile | null;
}
const AddComment: React.FC<AddCommentProps> = ({ onSubmit, isSubmitting, user }) => {
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
  };
  
  if (!user) {
    return (
      <div className="bg-muted/50 p-4 rounded-lg mb-8 text-center">
        <p className="mb-2">Sign in to join the discussion</p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Add a Comment</h2>
      <textarea
        className="w-full p-3 border rounded-md resize-y min-h-[100px] bg-background"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts..."
        required
      />
      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting || !comment.trim()}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

interface CommentsListProps {
  comments: Comment[];
  formatTimeAgo: (date: string) => string;
}
const CommentsList: React.FC<CommentsListProps> = ({ comments, formatTimeAgo }) => {
  if (!comments.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.map((comment: Comment) => (
        <div key={comment.id} className="p-4 border rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{comment.author_name || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
          </div>
          <p>{comment.comment}</p>
        </div>
      ))}
    </div>
  );
};

interface NotFoundCardProps {
  onNavigateBack: () => void;
}
const NotFoundCard: React.FC<NotFoundCardProps> = ({ onNavigateBack }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
    <p className="text-muted-foreground mb-6">The forum post you're looking for doesn't exist or has been removed.</p>
    <Button onClick={onNavigateBack}>Back to Forum</Button>
  </div>
);

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use custom hooks for forum state and actions
  const { isLoading, discussion, comments: hookComments, setComments } = useForumPost(id);
  const { isSubmitting, handleUpvote, handleSubmitComment } = useForumActions(id);

  const [hasUpvoted, setHasUpvoted] = useState(false);

  // Handle upvoting the post
  const handleUpvotePost = async () => {
    if (discussion && user) {
      // Only pass required fields from user to handle type compatibility
      const userProfile: UserProfile = {
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
        avatar_url: user.avatar_url || user.avatar || '',
        name: user.name || '',
        status: user.status || 'online',
        isGhostMode: user.isGhostMode || false,
        role: user.role || 'user',
        isAdmin: user.isAdmin || false
      };
      
      // Convert discussion to ForumDiscussion type with explicit typing
      const discussionWithUserId: ForumDiscussion = {
        id: discussion.id,
        upvotes: discussion.upvotes,
        user_id: discussion.authorId, // Use authorId as the user_id
      };
      
      try {
        await handleUpvote(userProfile, discussionWithUserId);
        setHasUpvoted(true);
        toast({
          description: "You upvoted this post",
        });
      } catch (error) {
        console.error('Error upvoting:', error);
        toast({
          title: "Error",
          description: "Failed to upvote post",
          variant: "destructive"
        });
      }
    }
  };

  // Handle sharing the post
  const handleSharePost = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: discussion?.title || 'Forum Discussion',
        text: 'Check out this discussion on Polymath Community',
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard();
      });
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  }, [discussion]);

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          description: "Link copied to clipboard!",
        });
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive"
        });
      });
  };
  
  // Handle adding a new comment
  const handleAddComment = async (comment: string) => {
    if (!user || !discussion) return;
    
    // Only pass required fields from user to handle type compatibility
    const userProfile: UserProfile = {
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      avatar: user.avatar || '',
      avatar_url: user.avatar_url || user.avatar || '',
      name: user.name || '',
      status: user.status || 'online',
      isGhostMode: user.isGhostMode || false,
      role: user.role || 'user',
      isAdmin: user.isAdmin || false
    };
    
    // Convert discussion to ForumDiscussion type with explicit typing
    const discussionWithUserId: ForumDiscussion = {
      id: discussion.id,
      upvotes: discussion.upvotes,
      user_id: discussion.authorId, // Use authorId as the user_id
    };
    
    await handleSubmitComment(userProfile, comment, discussionWithUserId, setComments);
  };

  // Convert the hook's comments to our local Comment format
  const adaptedComments = React.useMemo(() => {
    return adaptComments(hookComments as any[] || []);
  }, [hookComments]);

  return (
    <PageSEO
      title={discussion ? `${discussion.title} | Forum` : 'Forum Post | Polymath Community'}
      description={discussion ? `Join the discussion: ${discussion.title}` : 'View this forum post on Polymath Community'}
      ogType="article"
      canonicalUrl={discussion ? `https://polymathcommunity.com/forum/${discussion.id}` : undefined}
    >
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/forum')}
        >
          <ArrowLeft size={16} />
          Back to Forum
        </Button>
        
        {isLoading ? (
          <ForumSkeleton />
        ) : discussion ? (
          <>
            <ForumPostDetails discussion={discussion} />
            
            <ForumPostStats
              views={discussion.views}
              comments={adaptedComments.length}
              upvotes={discussion.upvotes}
              createdAt={discussion.createdAt} 
              formatTimeAgo={formatTimeAgo}
              onUpvote={handleUpvotePost}
              hasUpvoted={hasUpvoted}
              isAuthenticated={!!user}
              onShare={handleSharePost}
            />
            
            {/* Add comment */}
            <AddComment
              onSubmit={handleAddComment}
              isSubmitting={isSubmitting}
              user={user}
            />
            
            {/* Comments */}
            <h2 className="text-2xl font-semibold mb-4">
              Replies {adaptedComments.length > 0 ? `(${adaptedComments.length})` : ''}
            </h2>
            <CommentsList 
              comments={adaptedComments}
              formatTimeAgo={formatTimeAgo}
            />
          </>
        ) : (
          <NotFoundCard onNavigateBack={() => navigate('/forum')} />
        )}
      </div>
    </PageSEO>
  );
};

export default ForumPost;
