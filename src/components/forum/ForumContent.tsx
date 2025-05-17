
import React from 'react';
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscussionTopicCard } from "../DiscussionTopicCard";
import { Badge } from "@/components/ui/badge";
import { DiscussionTopic } from "@/lib/discussions-utils";

interface ForumContentProps {
  isLoading: boolean;
  filteredDiscussions: DiscussionTopic[];
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  setSearchTerm: (term: string) => void;
  onDiscussionClick: (discussion: DiscussionTopic) => void;
}

export const ForumContent = ({
  isLoading,
  filteredDiscussions,
  activeTag,
  setActiveTag,
  setSearchTerm,
  onDiscussionClick
}: ForumContentProps) => {
  return (
    <>
      {activeTag && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active Filter:</span>
          <Badge className="flex items-center gap-1">
            {activeTag}
            <button
              className="ml-2 hover:text-foreground"
              onClick={() => setActiveTag(null)}
            >
              ×
            </button>
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          // Skeleton UI for loading state
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="bg-card rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-3" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <DiscussionTopicCard 
              key={discussion.id} 
              discussion={discussion} 
              onClick={() => onDiscussionClick(discussion)}
            />
          ))
        ) : (
          <Card className="bg-card rounded-lg p-8 text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-muted p-4">
                  <MessageSquare size={32} className="text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No discussions found matching your criteria.</p>
              <Button 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setActiveTag(null);
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
