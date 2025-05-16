
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Globe, Bell, Lock, User, Monitor, Moon, Sun, Volume2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    general: {
      theme: "system",
      language: "english",
      fontSize: 16
    },
    notifications: {
      email: true,
      push: true,
      mentions: true,
      newMessages: true,
      dailyDigest: false,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: "public",
      activityVisibility: "members",
      showOnlineStatus: true,
      allowDiscovery: true
    },
    sound: {
      volume: 75,
      messageSounds: true,
      notificationSounds: true,
      ambientSounds: false
    }
  });
  
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  const handleSaveSettings = async (section) => {
    if (!user) {
      toast({
        title: "You must be logged in",
        description: "Please log in to save your settings",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // In a real app, this would send to Supabase
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated successfully.`
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32 mt-2 md:mt-0" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="mr-2">Reset</Button>
          <Button>Save All</Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full md:w-auto flex flex-wrap md:inline-flex">
          <TabsTrigger value="general" className="flex-1 md:flex-none flex items-center gap-2">
            <Globe size={16} />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 md:flex-none flex items-center gap-2">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex-1 md:flex-none flex items-center gap-2">
            <Lock size={16} />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="sound" className="flex-1 md:flex-none flex items-center gap-2">
            <Volume2 size={16} />
            <span>Sound</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general preferences and account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <RadioGroup 
                    defaultValue={settings.general.theme}
                    onValueChange={(value) => handleChange("general", "theme", value)}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="flex items-center gap-2 cursor-pointer">
                        <Sun size={18} />
                        <span>Light</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="flex items-center gap-2 cursor-pointer">
                        <Moon size={18} />
                        <span>Dark</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="flex items-center gap-2 cursor-pointer">
                        <Monitor size={18} />
                        <span>System</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={settings.general.language}
                    onValueChange={(value) => handleChange("general", "language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="font-size">Font Size ({settings.general.fontSize}px)</Label>
                  </div>
                  <Slider
                    id="font-size"
                    min={12}
                    max={24}
                    step={1}
                    value={[settings.general.fontSize]}
                    onValueChange={([value]) => handleChange("general", "fontSize", value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("general")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifs" className="flex-1">Receive email notifications</Label>
                      <Switch
                        id="email-notifs"
                        checked={settings.notifications.email}
                        onCheckedChange={(value) => handleChange("notifications", "email", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="daily-digest" className="flex-1">Daily digest summary</Label>
                      <Switch
                        id="daily-digest"
                        checked={settings.notifications.dailyDigest}
                        onCheckedChange={(value) => handleChange("notifications", "dailyDigest", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails" className="flex-1">Marketing emails</Label>
                      <Switch
                        id="marketing-emails"
                        checked={settings.notifications.marketingEmails}
                        onCheckedChange={(value) => handleChange("notifications", "marketingEmails", value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Platform Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifs" className="flex-1">Push notifications</Label>
                      <Switch
                        id="push-notifs"
                        checked={settings.notifications.push}
                        onCheckedChange={(value) => handleChange("notifications", "push", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mentions" className="flex-1">When someone mentions you</Label>
                      <Switch
                        id="mentions"
                        checked={settings.notifications.mentions}
                        onCheckedChange={(value) => handleChange("notifications", "mentions", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-messages" className="flex-1">New messages</Label>
                      <Switch
                        id="new-messages"
                        checked={settings.notifications.newMessages}
                        onCheckedChange={(value) => handleChange("notifications", "newMessages", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("notifications")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your profile and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select 
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => handleChange("privacy", "profileVisibility", value)}
                  >
                    <SelectTrigger id="profile-visibility">
                      <SelectValue placeholder="Who can see your profile" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border">
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="activity-visibility">Activity Visibility</Label>
                  <Select 
                    value={settings.privacy.activityVisibility}
                    onValueChange={(value) => handleChange("privacy", "activityVisibility", value)}
                  >
                    <SelectTrigger id="activity-visibility">
                      <SelectValue placeholder="Who can see your activity" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border">
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Only Me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="online-status" className="flex-1">Show online status</Label>
                    <Switch
                      id="online-status"
                      checked={settings.privacy.showOnlineStatus}
                      onCheckedChange={(value) => handleChange("privacy", "showOnlineStatus", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-discovery" className="flex-1">Allow others to find you</Label>
                    <Switch
                      id="allow-discovery"
                      checked={settings.privacy.allowDiscovery}
                      onCheckedChange={(value) => handleChange("privacy", "allowDiscovery", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("privacy")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sound">
          <Card>
            <CardHeader>
              <CardTitle>Sound Settings</CardTitle>
              <CardDescription>Customize sound options for notifications and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="volume">Main Volume ({settings.sound.volume}%)</Label>
                  </div>
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[settings.sound.volume]}
                    onValueChange={([value]) => handleChange("sound", "volume", value)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message-sounds" className="flex-1">Message sounds</Label>
                    <Switch
                      id="message-sounds"
                      checked={settings.sound.messageSounds}
                      onCheckedChange={(value) => handleChange("sound", "messageSounds", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notification-sounds" className="flex-1">Notification sounds</Label>
                    <Switch
                      id="notification-sounds"
                      checked={settings.sound.notificationSounds}
                      onCheckedChange={(value) => handleChange("sound", "notificationSounds", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ambient-sounds" className="flex-1">Ambient sounds</Label>
                    <Switch
                      id="ambient-sounds"
                      checked={settings.sound.ambientSounds}
                      onCheckedChange={(value) => handleChange("sound", "ambientSounds", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("sound")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-red-500 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-300">Danger Zone</h3>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive" size="sm">Delete Account</Button>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">Export Data</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
