
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ForumSkeleton } from '@/components/forum/post/ForumSkeleton';
import { ForumPostDetails } from '@/components/forum/post/ForumPostDetails';
import { ForumPostStats } from '@/components/forum/post/ForumPostStats';
import { CommentsList } from '@/components/forum/comments/CommentsList';
import { NotFoundCard } from '@/components/forum/post/NotFoundCard';
import { AddComment } from '@/components/forum/comments/AddComment';
import { useForumPost } from '@/hooks/forum/useForumPost';
import { useForumActions } from '@/hooks/forum/useForumActions';
import { formatTimeAgo } from '@/utils/formatters';

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use custom hooks for forum state and actions
  const { isLoading, discussion, comments, setComments } = useForumPost(id);
  const { isSubmitting, handleUpvote, handleSubmitComment } = useForumActions(id);

  const handleUpvotePost = async () => {
    if (discussion) {
      await handleUpvote(user, discussion);
      // The hook handles updating the discussion state
    }
  };
  
  const handleAddComment = async (comment: string) => {
    await handleSubmitComment(user, comment, discussion, setComments);
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
