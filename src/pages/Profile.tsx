
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { UserProfileComponent } from "../components/profile/UserProfileComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageLayout } from "../components/layouts/PageLayout";
import { UserProfile as UserProfileType, UserStatus, UserRole } from "../types/user";
import { useToast } from "@/hooks/use-toast";
import { trackActivity } from "@/lib/activity-tracker";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        
        // Convert Supabase profile to our UserProfile type
        const userProfile: UserProfileType = {
          id: data.id,
          name: data.name || "",
          username: data.username,
          email: currentUser?.email || "",
          avatar: data.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${data.username}`,
          avatar_url: data.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${data.username}`,
          bio: data.bio || "",
          website: data.website || "",
          status: (data.status as UserStatus) || "offline",
          isGhostMode: data.is_ghost_mode || false,
          role: (data.role as UserRole) || "user",
          isAdmin: data.role === "admin",
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
    
    if (currentUser || username) {
      fetchProfile();
    } else {
      // Redirect to login if no current user and no username provided
      navigate('/auth');
    }
  }, [username, currentUser, navigate]);

  // Handle profile update
  const handleUpdateProfile = async (updates: Partial<UserProfileType>) => {
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
      
      const { error: updateError } = await updateProfile(updates);
      
      if (updateError) {
        throw updateError;
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
          <Alert variant="destructive">
            <AlertDescription>
              Error loading profile: {error}
            </AlertDescription>
          </Alert>
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
