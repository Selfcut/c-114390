
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ContentFeedEmptyProps {
  onRefresh: () => void;
}

export const ContentFeedEmpty: React.FC<ContentFeedEmptyProps> = ({ onRefresh }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-muted-foreground"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 8h7" />
          <path d="M8 12h8" />
          <path d="M11 16h5" />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-1">No content found</h3>
      <p className="text-muted-foreground mb-4">Try selecting a different content type or check back later.</p>
      <Button variant="outline" onClick={onRefresh} className="gap-2">
        <RefreshCw size={16} />
        Refresh
      </Button>
    </div>
  );
};
