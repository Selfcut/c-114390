
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
  })
};

export { useToast, toast, polymathToast };
