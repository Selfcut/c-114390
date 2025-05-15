
import React from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  BookOpen,
  PenSquare,
  Inbox,
  Bell,
  Search,
  User,
  Heart,
  FileText,
  Bookmark,
  Calendar,
  AlertCircle,
  Library
} from "lucide-react";

interface EmptyStateProps {
  type: 
    | "messages" 
    | "notifications" 
    | "search" 
    | "forum" 
    | "library" 
    | "profile" 
    | "favorites"
    | "history"
    | "bookmarks"
    | "events"
    | "error"
    | "wiki"
    | "custom";
  title?: string;
  description?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  icon,
  onAction
}) => {
  // Default values based on type
  let defaultIcon;
  let defaultTitle;
  let defaultDescription;
  let defaultActionLabel;
  
  switch (type) {
    case "messages":
      defaultIcon = <MessageSquare size={40} />;
      defaultTitle = "No messages yet";
      defaultDescription = "Start a conversation with someone or wait for messages to arrive.";
      defaultActionLabel = "Start a conversation";
      break;
    case "notifications":
      defaultIcon = <Bell size={40} />;
      defaultTitle = "No notifications";
      defaultDescription = "You're all caught up! Check back later for updates.";
      defaultActionLabel = "Manage notification settings";
      break;
    case "search":
      defaultIcon = <Search size={40} />;
      defaultTitle = "No results found";
      defaultDescription = "Try adjusting your search terms or filters.";
      defaultActionLabel = "Clear filters";
      break;
    case "forum":
      defaultIcon = <MessageSquare size={40} />;
      defaultTitle = "No discussions yet";
      defaultDescription = "Be the first to start a discussion in this forum.";
      defaultActionLabel = "Start a discussion";
      break;
    case "library":
      defaultIcon = <BookOpen size={40} />;
      defaultTitle = "Library is empty";
      defaultDescription = "No content matches your current filters or search terms.";
      defaultActionLabel = "Browse all content";
      break;
    case "profile":
      defaultIcon = <User size={40} />;
      defaultTitle = "Profile not complete";
      defaultDescription = "Complete your profile to get the most out of your experience.";
      defaultActionLabel = "Complete profile";
      break;
    case "favorites":
      defaultIcon = <Heart size={40} />;
      defaultTitle = "No favorites yet";
      defaultDescription = "Items you favorite will appear here.";
      defaultActionLabel = "Explore content";
      break;
    case "history":
      defaultIcon = <FileText size={40} />;
      defaultTitle = "No history";
      defaultDescription = "Your recently viewed items will appear here.";
      defaultActionLabel = "Explore content";
      break;
    case "bookmarks":
      defaultIcon = <Bookmark size={40} />;
      defaultTitle = "No bookmarks yet";
      defaultDescription = "Save items for later by bookmarking them.";
      defaultActionLabel = "Browse content";
      break;
    case "events":
      defaultIcon = <Calendar size={40} />;
      defaultTitle = "No upcoming events";
      defaultDescription = "There are no events scheduled at this time.";
      defaultActionLabel = "Create an event";
      break;
    case "error":
      defaultIcon = <AlertCircle size={40} />;
      defaultTitle = "Something went wrong";
      defaultDescription = "We encountered an error while processing your request.";
      defaultActionLabel = "Try again";
      break;
    case "wiki":
      defaultIcon = <Library size={40} />;
      defaultTitle = "No entries found";
      defaultDescription = "There are no wiki entries matching your criteria.";
      defaultActionLabel = "Create an entry";
      break;
    case "custom":
    default:
      defaultIcon = <AlertCircle size={40} />;
      defaultTitle = "Nothing here yet";
      defaultDescription = "Content will appear here soon.";
      defaultActionLabel = "Back to home";
      break;
  }
  
  const displayIcon = icon || defaultIcon;
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  const displayActionLabel = actionLabel || defaultActionLabel;
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
        {displayIcon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{displayTitle}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {displayDescription}
      </p>
      {onAction && (
        <Button onClick={onAction} className="hover-lift">
          {displayActionLabel}
        </Button>
      )}
    </div>
  );
};

// Additional component for content placeholders/loading states
export const ContentPlaceholder: React.FC<{
  type: "card" | "list" | "text" | "image" | "avatar";
  count?: number;
}> = ({ type, count = 1 }) => {
  const renderPlaceholderItem = (key: number) => {
    switch (type) {
      case "card":
        return (
          <div 
            key={key} 
            className="w-full h-40 rounded-lg bg-muted animate-pulse"
          ></div>
        );
      case "list":
        return (
          <div key={key} className="w-full flex items-center space-x-4 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        );
      case "text":
        return (
          <div key={key} className="space-y-2 w-full animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        );
      case "image":
        return (
          <div 
            key={key} 
            className="w-full aspect-video rounded-lg bg-muted animate-pulse"
          ></div>
        );
      case "avatar":
        return (
          <div 
            key={key} 
            className="h-12 w-12 rounded-full bg-muted animate-pulse"
          ></div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => renderPlaceholderItem(i))}
    </div>
  );
};

// SVG placeholder illustrations for empty states
export const EmptyStateIllustration: React.FC<{
  type: "messages" | "search" | "books" | "notifications" | "calendar" | "error";
}> = ({ type }) => {
  switch (type) {
    case "messages":
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <rect x="40" y="40" width="120" height="120" rx="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <path d="M70 80H130M70 100H110M70 120H90" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
          <circle cx="150" cy="50" r="30" fill="currentColor" fillOpacity="0.1" />
          <path d="M140 50L150 60L160 40" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "search":
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <circle cx="90" cy="90" r="40" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <path d="M120 120L140 140" stroke="currentColor" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
          <circle cx="90" cy="90" r="20" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    case "books":
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <rect x="40" y="60" width="30" height="90" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <rect x="80" y="50" width="30" height="100" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <rect x="120" y="70" width="30" height="80" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <path d="M40 150H150" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        </svg>
      );
    case "notifications":
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <path d="M100 60V70M100 150C111.046 150 120 141.046 120 130H80C80 141.046 88.9543 150 100 150Z" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
          <path d="M135 110C135 94.5379 128.281 80.1012 116.066 69.8901C103.851 59.6791 87.2327 55.4382 71.1729 58.4573C55.1131 61.4764 41.3463 71.3948 33.622 85.7823C25.8977 100.17 25.0902 117.294 31.4112 132.427C37.7322 147.561 50.5163 158.975 66.1275 163.577C81.7387 168.179 98.5093 165.494 111.678 156.258C124.847 147.021 132.904 132.266 133.851 116.147" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 90L100 120" stroke="currentColor" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="50" r="20" fill="currentColor" fillOpacity="0.1" />
          <circle cx="150" cy="50" r="10" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case "calendar":
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <rect x="40" y="60" width="120" height="100" rx="4" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <path d="M40 80H160" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <path d="M70 50V70M130 50V70" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
          <rect x="60" y="100" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
          <rect x="90" y="100" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
          <rect x="120" y="100" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
          <rect x="60" y="130" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    case "error":
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <path d="M100 70V110" stroke="currentColor" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="130" r="5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    default:
      return null;
  }
};
