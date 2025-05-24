
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { UserProfileComponent } from "../components/profile/UserProfileComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageLayout } from "../components/layouts/PageLayout";
import { UserProfile as UserProfileType, UserStatus, UserRole } from "../types/user";
import { useToast } from "@/hooks/use-toast";
import { trackActivity } from "@/lib/activity-tracker";
import { fetchUserProfile, ensureUserProfile } from "@/lib/auth/profiles-service";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let userData = null;
      
      // If username is provided, fetch that profile, otherwise fetch current user's profile
      if (username) {
        // Get user by username
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        if (!data) throw new Error("Profile not found");
        
        userData = data;
      } else if (currentUser?.id) {
        // For current user, we can use the profile from auth context
        setProfileData(currentUser);
        setIsLoading(false);
        return;
      } else {
        throw new Error("No user ID or username available");
      }
      
      // Convert Supabase profile to our UserProfile type
      const userProfile: UserProfileType = {
        id: userData.id,
        name: userData.name || "",
        username: userData.username,
        email: currentUser?.email || "",
        avatar: userData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.username}`,
        avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.username}`,
        bio: userData.bio || "",
        website: userData.website || "",
        status: (userData.status as UserStatus) || "offline",
        isGhostMode: userData.is_ghost_mode || false,
        role: (userData.role as UserRole) || "user",
        isAdmin: userData.role === "admin",
        notificationSettings: {
          desktopNotifications: true,
          soundNotifications: true,
          emailNotifications: true
        }
      };
      
      setProfileData(userProfile);
      
      // Track profile view if viewing someone else's profile
      if (currentUser && username && username !== currentUser.username) {
        await trackActivity(currentUser.id, 'view', { 
          section: 'profile',
          profile: username
        });
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentUser || username) {
      fetchProfile();
    } else {
      // Redirect to login if no current user and no username provided
      navigate('/auth');
    }
  }, [username, currentUser, navigate]);

  // Handle profile update - creating a wrapper to adapt between function signatures
  const handleUpdateProfile = async (updates: Partial<UserProfileType>): Promise<void> => {
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
      if (profileData?.id !== currentUser.id) {
        toast({
          title: "Not authorized",
          description: "You can only edit your own profile",
          variant: "destructive",
        });
        return;
      }
      
      // Ensure notificationSettings is properly structured
      if (updates.notificationSettings) {
        // Make sure all required fields are present
        updates.notificationSettings = {
          desktopNotifications: updates.notificationSettings.desktopNotifications ?? true,
          soundNotifications: updates.notificationSettings.soundNotifications ?? true,
          emailNotifications: updates.notificationSettings.emailNotifications ?? true
        };
      }
      
      // Call the updateUserProfile function from the auth context
      if (updateUserProfile) {
        try {
          await updateUserProfile(updates);
        } catch (updateError: any) {
          throw updateError;
        }
      }
      
      // Update local state
      setProfileData(prev => prev ? { ...prev, ...updates } : null);
      
      // Track profile update activity
      await trackActivity(currentUser.id, 'update', { 
        section: 'profile',
        fields: Object.keys(updates).join(',')
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Handle creation of missing profile
  const handleCreateProfile = async () => {
    if (!currentUser?.id) {
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    try {
      const profile = await ensureUserProfile(currentUser.id, {
        email: currentUser.email,
        name: currentUser.name,
        username: currentUser.username
      });
      
      if (profile) {
        setProfileData(profile);
        toast({
          title: "Profile created",
          description: "Your profile has been successfully created.",
        });
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to create your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
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
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          
          {currentUser && !profileData && (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
              <p className="mb-6">Your profile information is missing. Would you like to create one now?</p>
              <Button onClick={handleCreateProfile} className="mr-2">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Create Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        {profileData && (
          <UserProfileComponent
            profile={profileData}
            isCurrentUser={currentUser?.id === profileData.id}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Profile;
