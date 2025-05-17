
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface MediaErrorDisplayProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const MediaErrorDisplay = ({
  message,
  onRetry,
  isRetrying = false
}: MediaErrorDisplayProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          {message || "An error occurred while loading media content. Please try again."}
        </p>
        
        <Button 
          onClick={onRetry} 
          disabled={isRetrying}
          className="flex items-center gap-2"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Retrying...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
