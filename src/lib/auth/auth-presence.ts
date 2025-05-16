
import { UserProfile, UserStatus } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export const usePresenceManagement = (user: UserProfile | null, setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>) => {
  const { toast } = useToast();

  const toggleGhostMode = async () => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const newGhostMode = !user.isGhostMode;
      
      // In a real app with Supabase tables, this would update is_ghost_mode in the profiles table
      // For now, just update the local state
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, isGhostMode: newGhostMode } : null);
      
      toast({
        title: `Ghost mode ${newGhostMode ? 'enabled' : 'disabled'}`,
        description: newGhostMode ? 
          "You're now browsing invisibly" : 
          "You're now visible to other users",
      });
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
    }
  };

  const toggleDoNotDisturb = async () => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const isDoNotDisturb = user.status === "dnd" || user.status === "do-not-disturb";
      const newStatus: UserStatus = isDoNotDisturb ? "online" : "dnd";
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, status: newStatus } : null);
      
      // Update notification settings
      if (newStatus === "dnd" && user.notificationSettings) {
        setUser(prevUser => prevUser && prevUser.notificationSettings ? {
          ...prevUser,
          notificationSettings: {
            ...prevUser.notificationSettings,
            soundNotifications: false,
            desktopNotifications: false
          }
        } : prevUser);
      }
      
      toast({
        title: `Do Not Disturb ${newStatus === "dnd" ? 'enabled' : 'disabled'}`,
        description: newStatus === "dnd" ? 
          "All notifications are now muted" : 
          "Notifications have been restored",
      });
    } catch (error) {
      console.error('Error toggling do not disturb:', error);
    }
  };

  return {
    toggleGhostMode,
    toggleDoNotDisturb
  };
};
