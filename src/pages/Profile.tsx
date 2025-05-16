
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { UserProfile } from "../components/UserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // If username is provided, fetch that profile, otherwise fetch current user's profile
        const query = supabase
          .from('profiles')
          .select('*');
        
        if (username) {
          query.eq('username', username);
        } else if (currentUser?.id) {
          query.eq('id', currentUser.id);
        } else {
          throw new Error("No user ID or username available");
        }
        
        const { data, error: fetchError } = await query.single();
        
        if (fetchError) throw fetchError;
        if (!data) throw new Error("Profile not found");
        
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser || username) {
      fetchProfile();
    }
  }, [username, currentUser]);

  // Handle profile update
  const handleUpdateProfile = async (updates) => {
    try {
      if (!currentUser?.id) {
        toast({
          title: "Not authorized",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return;
      }
      
      // Check if this is the current user's profile
      if (profileData.id !== currentUser.id) {
        toast({
          title: "Not authorized",
          description: "You can only edit your own profile",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      // Update local state
      setProfileData({ ...profileData, ...updates });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading profile: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {profileData && (
        <UserProfile 
          profile={profileData} 
          isCurrentUser={currentUser?.id === profileData.id}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default Profile;
