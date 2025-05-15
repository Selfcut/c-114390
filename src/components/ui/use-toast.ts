
import { toast as internalToast } from "@/hooks/use-toast"

// Extend the toast API with specialized notification types
export const polymathToast = {
  welcomeBack: (days: number) => {
    internalToast({
      title: "Welcome back!",
      description: `It's been ${days} days since your last visit. We've missed you!`,
    });
  },
  
  contentRecommended: () => {
    internalToast({
      title: "Content Recommended",
      description: "New content recommendations ready for you.",
    });
  },
  
  resourceBookmarked: () => {
    internalToast({
      title: "Resource Bookmarked",
      description: "This resource has been added to your bookmarks.",
    });
  },
  
  discussionCreated: () => {
    internalToast({
      title: "Discussion Created",
      description: "Your discussion topic has been posted successfully.",
    });
  },
  
  contributionSaved: () => {
    internalToast({
      title: "Contribution Saved",
      description: "Thank you for your contribution to the knowledge base!",
    });
  },
  
  notificationCleared: () => {
    internalToast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    });
  },
  
  searchComplete: (resultsCount: number) => {
    internalToast({
      title: "Search Complete",
      description: `Found ${resultsCount} results matching your search.`,
    });
  },
  
  joinedStudyGroup: () => {
    internalToast({
      title: "Study Group Joined",
      description: "You have successfully joined this study group.",
    });
  },
  
  eventRegistered: () => {
    internalToast({
      title: "Event Registration Complete",
      description: "You have successfully registered for this event.",
    });
  }
};

// Add a default calling mechanism for polymathToast that restricts variant types
(polymathToast as any).call = (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
  internalToast(props);
};
(polymathToast as any).__proto__ = Function.prototype;

export { internalToast as toast };
