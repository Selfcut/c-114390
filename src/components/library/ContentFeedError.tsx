
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ContentFeedErrorProps {
  message?: string;
}

export const ContentFeedError: React.FC<ContentFeedErrorProps> = ({ 
  message = "An error occurred while loading content" 
}) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
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
          className="text-destructive"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-1">Error Loading Content</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={() => window.location.reload()} className="gap-2">
        <RefreshCw size={16} />
        Try Again
      </Button>
    </div>
  );
};
