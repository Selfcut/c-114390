import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useForumPost } from '@/hooks/forum/useForumPost';
import { useForumActions } from '@/hooks/forum/useForumActions';
import { formatTimeAgo } from '@/utils/formatters';
import { UserProfile } from '@/types/user';  // Import from the central location

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
      <span>Posted by {discussion.author_name || 'Anonymous'}</span>
    </div>
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: discussion.content }} />
    </div>
  </div>
);

interface ForumPostStatsProps {
  views: number;
  comments: number;
  upvotes: number;
  createdAt: string;
  formatTimeAgo: (date: string) => string;
}
const ForumPostStats: React.FC<ForumPostStatsProps> = ({ views, comments, upvotes, createdAt, formatTimeAgo }) => (
  <div className="flex flex-wrap gap-4 py-4 text-sm text-muted-foreground border-t border-b mt-6 mb-8">
    <div>{upvotes} upvotes</div>
    <div>{comments} comments</div>
    <div>{views} views</div>
    <div>{formatTimeAgo(createdAt)}</div>
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
        className="w-full p-3 border rounded-md resize-y min-h-[100px]"
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

interface Comment {
  id: string;
  author_name: string;
  created_at: string;
  comment: string;
}

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
  
  // Use custom hooks for forum state and actions
  const { isLoading, discussion, comments, setComments } = useForumPost(id);
  const { isSubmitting, handleUpvote, handleSubmitComment } = useForumActions(id);

  // Handle upvoting the post
  const handleUpvotePost = async () => {
    if (discussion && user) {
      // Only pass required fields from user to handle type compatibility
      const userProfile: UserProfile = {
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
        name: user.name || '',
        status: user.status || 'online',
        isGhostMode: user.isGhostMode || false,
        role: user.role || 'user',
        isAdmin: user.isAdmin || false
      };
      
      await handleUpvote(userProfile, discussion);
    }
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
      name: user.name || '',
      status: user.status || 'online',
      isGhostMode: user.isGhostMode || false,
      role: user.role || 'user',
      isAdmin: user.isAdmin || false
    };
    
    await handleSubmitComment(userProfile, comment, discussion, setComments);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
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
            <ForumPostDetails 
              discussion={discussion} 
              formatTimeAgo={formatTimeAgo} 
            />
            
            <ForumPostStats
              views={discussion.views}
              comments={comments.length}
              upvotes={discussion.upvotes}
              createdAt={discussion.createdAt}
              formatTimeAgo={formatTimeAgo}
            />
            
            {/* Add comment */}
            <AddComment
              onSubmit={handleAddComment}
              isSubmitting={isSubmitting}
              user={user}
            />
            
            {/* Comments */}
            <h2 className="text-2xl font-semibold mb-4">Replies</h2>
            <CommentsList 
              comments={comments}
              formatTimeAgo={formatTimeAgo}
            />
          </>
        ) : (
          <NotFoundCard onNavigateBack={() => navigate('/forum')} />
        )}
      </div>
    </PageLayout>
  );
};

export default ForumPost;
