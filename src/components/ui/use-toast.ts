import { toast } from "@/components/ui/toast"

// Extend the toast API with specialized notification types
export const polymathToast = {
  welcomeBack: (days: number) => {
    toast({
      title: "Welcome back!",
      description: `It's been ${days} days since your last visit. We've missed you!`,
    });
  },
  
  contentRecommended: () => {
    toast({
      title: "Content Recommended",
      description: "New content recommendations ready for you.",
    });
  },
  
  resourceBookmarked: () => {
    toast({
      title: "Resource Bookmarked",
      description: "This resource has been added to your bookmarks.",
    });
  },
  
  discussionCreated: () => {
    toast({
      title: "Discussion Created",
      description: "Your discussion topic has been posted successfully.",
    });
  },
  
  contributionSaved: () => {
    toast({
      title: "Contribution Saved",
      description: "Thank you for your contribution to the knowledge base!",
    });
  },
  
  notificationCleared: () => {
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    });
  },
  
  searchComplete: (resultsCount: number) => {
    toast({
      title: "Search Complete",
      description: `Found ${resultsCount} results matching your search.`,
    });
  }
};
