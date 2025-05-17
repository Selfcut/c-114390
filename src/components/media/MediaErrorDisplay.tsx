
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface MediaErrorDisplayProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const MediaErrorDisplay = ({ message, onRetry, isRetrying = false }: MediaErrorDisplayProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-medium mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-4">{message}</p>
        <Button onClick={onRetry} className="flex items-center gap-2" disabled={isRetrying}>
          <Loader2 className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};
