
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { DiscussionFilters } from "../components/DiscussionFilters";
import { ForumHeader } from "../components/forum/ForumHeader";
import { ForumContent } from "../components/forum/ForumContent";
import { GuestPrompt } from "../components/forum/GuestPrompt";
import { NewDiscussionDialog } from "../components/forum/NewDiscussionDialog";
import { useForumData } from '../hooks/forum/useForumData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from "@/hooks/use-toast";

const Forum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
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
    isError,
    refetch,
    allTags,
  } = useForumData();
  
  // Handle discussion click
  const handleDiscussionClick = (discussion: any) => {
    navigate(`/forum/${discussion.id}`);
  };
  
  // Handle creating a new discussion
  const handleCreateDiscussion = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a discussion",
        variant: "destructive",
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  // Handle successful discussion creation
  const handleDiscussionCreated = (postId: string) => {
    // Navigate to the new post
    toast({
      title: "Discussion Created",
      description: "Your discussion has been posted successfully!",
    });
    navigate(`/forum/${postId}`);
  };

  // Handle error fetching forum data
  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Error Loading Forum</h2>
          <p className="text-muted-foreground mb-6">
            We're having trouble loading the forum discussions. Please try again.
          </p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <ForumHeader onCreateDiscussion={handleCreateDiscussion} />
      
      <DiscussionFilters 
        onSortChange={setSortOption}
        onFilterChange={setActiveTag}
        onSearchChange={setSearchTerm}
        availableTags={allTags}
        currentSort={sortOption}
        currentTag={activeTag}
        currentSearch={searchTerm}
        isLoading={isLoading}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner text="Loading discussions..." />
        </div>
      ) : (
        <ForumContent
          filteredDiscussions={filteredDiscussions}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          setSearchTerm={setSearchTerm}
          onDiscussionClick={handleDiscussionClick}
        />
      )}
      
      {!isAuthenticated && <GuestPrompt />}
      
      <NewDiscussionDialog
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleDiscussionCreated}
      />
    </div>
  );
};

export default Forum;
