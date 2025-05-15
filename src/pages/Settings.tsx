
import React, { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  MessageSquare, 
  Mail, 
  LogOut,
  Upload,
  Trash2,
  BellOff
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // User settings state
  const [userSettings, setUserSettings] = useState({
    name: "Alex Morgan",
    username: "alexmorgan",
    email: "alex@example.com",
    bio: "Philosopher, mathematician, and science enthusiast. Exploring the intersection of quantum physics and consciousness.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    coverImage: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png",
    notifications: {
      email: true,
      push: true,
      mentions: true,
      replies: true,
      messages: true,
      newsletters: false,
      doNotDisturb: false,
      ghostMode: false
    },
    privacy: {
      profileVisibility: "public",
      activityVisibility: "followers",
      allowMessages: "anyone",
      showOnlineStatus: true,
      allowTagging: true
    },
    preferences: {
      contentLanguage: "english",
      emailDigest: "weekly",
      contentFilters: "moderate"
    }
  });
  
  // Handle form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (key: string) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };
  
  // Handle privacy setting changes
  const handlePrivacyChange = (key: string, value: string) => {
    setUserSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };
  
  // Handle privacy toggle
  const handlePrivacyToggle = (key: string) => {
    setUserSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key as keyof typeof prev.privacy]
      }
    }));
  };
  
  // Handle preferences change
  const handlePreferenceChange = (key: string, value: string) => {
    setUserSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };
  
  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would send data to Supabase
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };
  
  // Handle avatar upload
  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload to Supabase storage
    toast({
      title: "Upload feature",
      description: "Avatar upload functionality would be implemented here.",
    });
  };
  
  // Handle cover image upload
  const handleCoverUpload = () => {
    // In a real app, this would open a file picker and upload to Supabase storage
    toast({
      title: "Upload feature",
      description: "Cover image upload functionality would be implemented here.",
    });
  };
  
  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Redirect would happen via the auth state listener in App.tsx
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="container py-8 px-4 md:px-6 lg:px-8">
              <h1 className="text-3xl font-bold mb-6">Settings</h1>
              
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="hidden md:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell size={16} />
                    <span className="hidden md:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="hidden md:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette size={16} />
                    <span className="hidden md:inline">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="hidden md:inline">Account</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Profile Settings */}
                <TabsContent value="profile">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your personal information and how it appears to others.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <div className="mt-2 flex flex-col items-center md:items-start gap-4">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={userSettings.avatar} alt="Profile picture" />
                                <AvatarFallback>{userSettings.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
                                  <Upload size={14} className="mr-1" />
                                  Upload
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                                  <Trash2 size={14} className="mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="md:w-1/3">
                            <Label htmlFor="coverImage">Cover Image</Label>
                            <div className="mt-2 flex flex-col items-center md:items-start gap-4">
                              <div 
                                className="w-full h-32 rounded bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${userSettings.coverImage})` }}
                              ></div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleCoverUpload}>
                                  <Upload size={14} className="mr-1" />
                                  Upload
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                                  <Trash2 size={14} className="mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input 
                                id="name"
                                name="name" 
                                value={userSettings.name}
                                onChange={handleProfileChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input 
                                id="username"
                                name="username" 
                                value={userSettings.username}
                                onChange={handleProfileChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email"
                              name="email"
                              type="email" 
                              value={userSettings.email}
                              onChange={handleProfileChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                              id="bio"
                              name="bio" 
                              rows={4}
                              value={userSettings.bio}
                              onChange={handleProfileChange}
                              placeholder="Tell others about yourself..."
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleSaveSettings}>Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                          Configure how and when you want to be notified.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive email notifications about activity relevant to you
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.email}
                              onCheckedChange={() => handleNotificationToggle('email')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications on your device
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.push}
                              onCheckedChange={() => handleNotificationToggle('push')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Mentions</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify when someone mentions you in a discussion
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.mentions}
                              onCheckedChange={() => handleNotificationToggle('mentions')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Replies</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify when someone replies to your posts
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.replies}
                              onCheckedChange={() => handleNotificationToggle('replies')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Direct Messages</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify when you receive new messages
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.messages}
                              onCheckedChange={() => handleNotificationToggle('messages')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Do Not Disturb</Label>
                              <p className="text-sm text-muted-foreground">
                                Temporarily mute all notification sounds and alerts
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.doNotDisturb}
                              onCheckedChange={() => handleNotificationToggle('doNotDisturb')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Ghost Mode</Label>
                              <p className="text-sm text-muted-foreground">
                                Hide your online status while browsing
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.notifications.ghostMode}
                              onCheckedChange={() => handleNotificationToggle('ghostMode')}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleSaveSettings}>Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Privacy Settings */}
                <TabsContent value="privacy">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                        <CardDescription>
                          Control who can see your content and how people can interact with you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="profileVisibility">Profile Visibility</Label>
                            <Select 
                              value={userSettings.privacy.profileVisibility}
                              onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select who can see your profile" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="activityVisibility">Activity Visibility</Label>
                            <Select 
                              value={userSettings.privacy.activityVisibility}
                              onValueChange={(value) => handlePrivacyChange('activityVisibility', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select who can see your activity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="allowMessages">Who can message you</Label>
                            <Select 
                              value={userSettings.privacy.allowMessages}
                              onValueChange={(value) => handlePrivacyChange('allowMessages', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select who can message you" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="anyone">Anyone</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="none">No One</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Show Online Status</Label>
                              <p className="text-sm text-muted-foreground">
                                Let others see when you're active on the platform
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.privacy.showOnlineStatus}
                              onCheckedChange={() => handlePrivacyToggle('showOnlineStatus')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow Tagging</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow others to tag you in posts and comments
                              </p>
                            </div>
                            <Switch 
                              checked={userSettings.privacy.allowTagging}
                              onCheckedChange={() => handlePrivacyToggle('allowTagging')}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleSaveSettings}>Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Appearance Settings */}
                <TabsContent value="appearance">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appearance Settings</CardTitle>
                        <CardDescription>
                          Customize how the application looks for you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select 
                              value={theme}
                              onValueChange={handleThemeChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="contentLanguage">Content Language</Label>
                            <Select 
                              value={userSettings.preferences.contentLanguage}
                              onValueChange={(value) => handlePreferenceChange('contentLanguage', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your preferred language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="german">German</SelectItem>
                                <SelectItem value="chinese">Chinese</SelectItem>
                                <SelectItem value="japanese">Japanese</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleSaveSettings}>Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Account Settings */}
                <TabsContent value="account">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                          Manage your account details and subscription.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Change Password</Label>
                            <div className="grid gap-2">
                              <Input type="password" placeholder="Current password" />
                              <Input type="password" placeholder="New password" />
                              <Input type="password" placeholder="Confirm new password" />
                              <Button className="w-full sm:w-auto">Change Password</Button>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <Label className="text-base font-medium">Subscription</Label>
                            <div className="mt-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Free Plan</h4>
                                  <p className="text-sm text-muted-foreground">Basic features with limitations</p>
                                </div>
                                <Button>Upgrade to Premium</Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <Label className="text-base font-medium text-destructive">Danger Zone</Label>
                            <div className="mt-3 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                <div>
                                  <h4 className="font-medium">Delete Account</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all your data. This action cannot be undone.
                                  </p>
                                </div>
                                <Button variant="destructive" size="sm">
                                  Delete Account
                                </Button>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg bg-muted">
                                <div>
                                  <h4 className="font-medium">Log Out</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Log out of your account on this device.
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                  <LogOut size={16} className="mr-2" />
                                  Log Out
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
