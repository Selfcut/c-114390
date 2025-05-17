
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { PageLayout } from "@/components/layouts/PageLayout";
import { DiscussionFilters } from "../components/DiscussionFilters";
import { ForumHeader } from "../components/forum/ForumHeader";
import { ForumContent } from "../components/forum/ForumContent";
import { GuestPrompt } from "../components/forum/GuestPrompt";
import { NewDiscussionDialog } from "../components/forum/NewDiscussionDialog";
import { useForumData } from '../hooks/forum/useForumData';

const Forum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const {
    filteredDiscussions,
    sortOption,
    setSortOption,
    activeTag,
    setActiveTag,
    searchTerm,
    setSearchTerm,
    isLoading,
    allTags,
  } = useForumData();
  
  // Handle discussion click
  const handleDiscussionClick = (discussion: any) => {
    navigate(`/forum/${discussion.id}`);
  };
  
  // Handle creating a new discussion
  const handleCreateDiscussion = () => {
    setIsCreateDialogOpen(true);
  };

  // Handle successful discussion creation
  const handleDiscussionCreated = (postId: string) => {
    // Navigate to the new post
    navigate(`/forum/${postId}`);
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <ForumHeader onCreateDiscussion={handleCreateDiscussion} />
        
        <DiscussionFilters 
          onSortChange={setSortOption}
          onFilterChange={setActiveTag}
          onSearchChange={setSearchTerm}
          availableTags={allTags}
        />
        
        <ForumContent
          isLoading={isLoading}
          filteredDiscussions={filteredDiscussions}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          setSearchTerm={setSearchTerm}
          onDiscussionClick={handleDiscussionClick}
        />
        
        {!isAuthenticated && <GuestPrompt />}
        
        <NewDiscussionDialog
          isOpen={isCreateDialogOpen} 
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleDiscussionCreated}
        />
      </div>
    </PageLayout>
  );
};

export default Forum;
