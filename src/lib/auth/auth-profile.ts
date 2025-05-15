
import { UserProfile, UserStatus } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export const useProfileManagement = (user: UserProfile | null, setUser: (user: UserProfile | null) => void) => {
  const { toast } = useToast();

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // In a real app with Supabase tables, this would update the profiles table
      // For now, just update the local state
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
      
      if (updates.name) localStorage.setItem('userName', updates.name);
      if (updates.avatar) localStorage.setItem('userAvatar', updates.avatar);
      
      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserStatus = async (status: UserStatus) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // In a real app with Supabase tables, this would update the status in the profiles table
      // For now, just update the local state
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, status } : null);
      
      toast({
        title: `Status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return {
    updateProfile,
    updateUserStatus
  };
};
