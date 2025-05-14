
import { useToast, toast } from "@/hooks/use-toast";

// Add polymath specific toast messages
const polymathToast = {
  discussionCreated: () => toast({
    title: "Discussion Created",
    description: "Your intellectual discourse topic has been posted to the forum."
  }),
  contributionSaved: () => toast({
    title: "Contribution Saved",
    description: "Thank you for contributing to the Polymath knowledge library."
  }),
  joinedStudyGroup: () => toast({
    title: "Study Group Joined",
    description: "You've successfully joined the study group."
  }),
  resourceBookmarked: () => toast({
    title: "Resource Bookmarked",
    description: "This resource has been added to your reading list."
  }),
  mentorshipRequested: () => toast({
    title: "Mentorship Requested",
    description: "Your request has been sent. Mentors typically respond within 48 hours."
  }),
  progressSaved: () => toast({
    title: "Progress Saved",
    description: "Your learning progress has been recorded."
  }),
  notificationCleared: () => toast({
    title: "Notifications Cleared",
    description: "All notifications have been marked as read."
  }),
  welcomeBack: (daysAway: number) => toast({
    title: "Welcome Back",
    description: `It's been ${daysAway} ${daysAway === 1 ? 'day' : 'days'} since your last visit. There are new discussions waiting for you.`
  }),
  searchComplete: (results: number) => toast({
    title: "Search Complete",
    description: `Found ${results} ${results === 1 ? 'result' : 'results'} matching your query.`
  })
};

export { useToast, toast, polymathToast };
