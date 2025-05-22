
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  className,
  fullScreen = true,
  size = "md"
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-background",
        fullScreen ? "min-h-screen" : "min-h-[200px]",
        className
      )}
    >
      <div className={cn(
        "bg-card p-8 rounded-lg shadow-lg text-center",
        fullScreen ? "w-full max-w-md" : "w-full max-w-sm"
      )}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
          <h2 className="text-xl font-semibold">{message}</h2>
          <p className="text-muted-foreground">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
};
