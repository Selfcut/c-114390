
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
  }),
  eventRegistered: () => toast({
    title: "Event Registration Complete",
    description: "You've successfully registered for this event. A calendar invite has been sent to your email."
  }),
  contentRecommended: () => toast({
    title: "Recommendation Noted",
    description: "We'll use your preference to personalize your learning experience."
  }),
  notesSaved: () => toast({
    title: "Notes Saved",
    description: "Your study notes have been successfully saved and synced."
  }),
  connectionMade: (name: string) => toast({
    title: "New Connection",
    description: `You are now connected with ${name}. You can now message them directly.`
  }),
  achievementUnlocked: (achievement: string) => toast({
    title: "Achievement Unlocked",
    description: `Congratulations! You've earned the "${achievement}" badge.`
  }),
  studyStreakUpdated: (days: number) => toast({
    title: "Study Streak Updated",
    description: `You've maintained a ${days}-day learning streak. Keep it up!`
  }),
  quoteSubmitted: () => toast({
    title: "Quote submitted",
    description: "Your wisdom has been added to our collection."
  })
};

export { useToast, toast, polymathToast };
