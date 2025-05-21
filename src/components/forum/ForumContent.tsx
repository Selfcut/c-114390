
import React from 'react';
import { MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiscussionTopicCard } from "../DiscussionTopicCard";
import { DiscussionTopic } from "@/lib/discussions-utils";

interface ForumContentProps {
  filteredDiscussions: DiscussionTopic[];
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  setSearchTerm: (term: string) => void;
  onDiscussionClick: (discussion: DiscussionTopic) => void;
}

export const ForumContent = ({
  filteredDiscussions,
  activeTag,
  setActiveTag,
  setSearchTerm,
  onDiscussionClick
}: ForumContentProps) => {
  // Helper function to check if an array is empty
  const isEmpty = (arr: any[]): boolean => !arr || arr.length === 0;

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
              aria-label="Remove filter"
            >
              ×
            </button>
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {isEmpty(filteredDiscussions) ? (
          <Card className="bg-card rounded-lg p-8 text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-muted p-4">
                  <AlertCircle size={32} className="text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any discussions matching your criteria.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTag(null);
                  }}
                >
                  Reset Filters
                </Button>
                <Button 
                  className="mt-2"
                  onClick={() => document.getElementById('create-discussion-btn')?.click()}
                >
                  Start a Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDiscussions.map((discussion) => (
            <DiscussionTopicCard 
              key={discussion.id} 
              discussion={discussion} 
              onClick={() => onDiscussionClick(discussion)}
            />
          ))
        )}
      </div>
    </>
  );
};
