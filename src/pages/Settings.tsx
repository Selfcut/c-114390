import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { TabNav } from "../components/TabNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Layout,
  Key,
  Save,
  Loader2,
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    website: ""
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    activitySummary: true,
    newFollowers: true,
    mentions: true,
    directMessages: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showActivity: true,
    showContributions: true,
    ghostMode: false
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    compactView: false,
    enableAnimations: true,
    highContrast: false
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30days"
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        
        // Set profile settings
        setProfileSettings({
          name: data.name || "",
          username: data.username || "",
          email: user.email || "",
          bio: data.bio || "",
          website: data.website || ""
        });
        
        // Set privacy settings
        setPrivacySettings(prev => ({
          ...prev,
          ghostMode: data.is_ghost_mode || false
        }));
        
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast({
          title: "Error loading settings",
          description: "Could not load your profile settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Handle profile form submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileSettings.name,
          username: profileSettings.username,
          bio: profileSettings.bio,
          website: profileSettings.website
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Settings updated",
        description: "Your profile settings have been saved."
      });
      
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle privacy settings submit
  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          is_ghost_mode: privacySettings.ghostMode
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been saved."
      });
      
    } catch (err) {
      console.error("Error updating privacy settings:", err);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle notification settings submit
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Save notification settings (mock implementation for now)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved."
      });
      
    } catch (err) {
      console.error("Error updating notification settings:", err);
      toast({
        title: "Update failed",
        description: "Could not save notification settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle appearance settings submit
  const handleAppearanceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Save appearance settings (mock implementation for now)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Appearance settings updated",
        description: "Your appearance settings have been saved."
      });
      
    } catch (err) {
      console.error("Error updating appearance settings:", err);
      toast({
        title: "Update failed",
        description: "Could not save appearance settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle security settings submit
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Save security settings (mock implementation for now)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Security settings updated",
        description: "Your security settings have been saved."
      });
      
    } catch (err) {
      console.error("Error updating security settings:", err);
      toast({
        title: "Update failed",
        description: "Could not save security settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Settings tabs
  const settingsTabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <User size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileSettings.username}
                      onChange={(e) => setProfileSettings({...profileSettings, username: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileSettings.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profileSettings.website}
                    onChange={(e) => setProfileSettings({...profileSettings, website: e.target.value})}
                  />
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Delivery Methods</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications" className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notification Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="activitySummary">Activity Summary</Label>
                    <Switch
                      id="activitySummary"
                      checked={notificationSettings.activitySummary}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, activitySummary: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newFollowers">New Followers</Label>
                    <Switch
                      id="newFollowers"
                      checked={notificationSettings.newFollowers}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newFollowers: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentions">Mentions</Label>
                    <Switch
                      id="mentions"
                      checked={notificationSettings.mentions}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, mentions: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="directMessages">Direct Messages</Label>
                    <Switch
                      id="directMessages"
                      checked={notificationSettings.directMessages}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, directMessages: checked})}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: <Shield size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePrivacySubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <select
                      id="profileVisibility"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                    >
                      <option value="public">Public - Anyone can view your profile</option>
                      <option value="authenticated">Authenticated - Only registered users can view your profile</option>
                      <option value="private">Private - Only you can view your profile</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showActivity" className="text-base">Show Activity</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your activity</p>
                    </div>
                    <Switch
                      id="showActivity"
                      checked={privacySettings.showActivity}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showActivity: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showContributions" className="text-base">Show Contributions</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your contributions</p>
                    </div>
                    <Switch
                      id="showContributions"
                      checked={privacySettings.showContributions}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showContributions: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ghostMode" className="text-base">Ghost Mode</Label>
                      <p className="text-sm text-muted-foreground">Browse without updating your online status</p>
                    </div>
                    <Switch
                      id="ghostMode"
                      checked={privacySettings.ghostMode}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, ghostMode: checked})}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Layout size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize your visual experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppearanceSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactView" className="text-base">Compact View</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                    </div>
                    <Switch
                      id="compactView"
                      checked={appearanceSettings.compactView}
                      onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, compactView: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAnimations" className="text-base">Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">Show animations throughout the interface</p>
                    </div>
                    <Switch
                      id="enableAnimations"
                      checked={appearanceSettings.enableAnimations}
                      onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, enableAnimations: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="highContrast" className="text-base">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better accessibility</p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={appearanceSettings.highContrast}
                      onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, highContrast: checked})}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "security",
      label: "Security",
      icon: <Key size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth" className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginNotifications" className="text-base">Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      id="loginNotifications"
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginNotifications: checked})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                    <select
                      id="sessionTimeout"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    >
                      <option value="1hour">1 hour</option>
                      <option value="8hours">8 hours</option>
                      <option value="24hours">24 hours</option>
                      <option value="7days">7 days</option>
                      <option value="30days">30 days</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
        <SettingsIcon className="text-primary" />
        Settings
      </h1>

      {isLoading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <TabNav tabs={settingsTabs} defaultTab="profile" />
      )}
    </div>
  );
};

export default Settings;
