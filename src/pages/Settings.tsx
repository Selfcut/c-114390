
import { useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Eye, 
  Shield, 
  Key, 
  Upload, 
  Trash,
  Save,
  X,
  Ghost
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { user, updateProfile, updateUserStatus, toggleGhostMode } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    avatar: user?.avatar || "",
    coverImage: "",
    fieldOfStudy: [],
  });
  const [isUploading, setIsUploading] = useState(false);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    desktopNotifications: user?.notificationSettings?.desktopNotifications ?? true,
    soundNotifications: user?.notificationSettings?.soundNotifications ?? true,
    emailNotifications: user?.notificationSettings?.emailNotifications ?? true,
    mentionNotifications: true,
    newMessageNotifications: true,
    forumNotifications: true,
    systemNotifications: true,
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    showLastSeen: true,
    allowDirectMessages: true,
    showReadingActivity: true,
    allowProfileViews: true,
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update profile in Supabase and local state
    await updateProfile({
      name: profileForm.name,
      avatar: profileForm.avatar,
    });
  };

  const handleNotificationSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update notification settings
    await updateProfile({
      notificationSettings: {
        desktopNotifications: notificationSettings.desktopNotifications,
        soundNotifications: notificationSettings.soundNotifications,
        emailNotifications: notificationSettings.emailNotifications,
      },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // In a real app, you would upload the file to Supabase storage
      // For now, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a data URL from the file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileForm({
          ...profileForm,
          avatar: e.target?.result as string,
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  return (
    <PageLayout>
      <div className="py-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <div className="flex flex-col space-y-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                <TabsTrigger 
                  value="profile" 
                  className="w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-accent/50"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-accent/50"
                >
                  <Bell size={16} className="mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-accent/50"
                >
                  <Eye size={16} className="mr-2" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-accent/50"
                >
                  <Shield size={16} className="mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Content */}
          <div>
            <TabsContent value="profile" className="mt-0 space-y-6">
              <form onSubmit={handleProfileSubmit}>
                {/* Profile Picture */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Update your profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileForm.avatar} />
                      <AvatarFallback>{profileForm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="relative"
                          disabled={isUploading}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                          />
                          <Upload size={14} className="mr-1" />
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        {profileForm.avatar && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setProfileForm({ ...profileForm, avatar: "" })}
                          >
                            <Trash size={14} className="mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 256x256px. Max size: 2MB.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Profile Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, name: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        To change your email, please go to security settings.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="field">Primary Field of Study</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="philosophy">Philosophy</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="psychology">Psychology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button">Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <form onSubmit={handleNotificationSettingsSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications on your desktop when you're using the app
                            </p>
                          </div>
                          <Switch
                            id="desktop-notifications"
                            checked={notificationSettings.desktopNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                desktopNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sound-notifications">Sound Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Play a sound when you receive new notifications
                            </p>
                          </div>
                          <Switch
                            id="sound-notifications"
                            checked={notificationSettings.soundNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                soundNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive important updates via email
                            </p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Types</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="mention-notifications">Mentions</Label>
                            <p className="text-sm text-muted-foreground">
                              When someone mentions you in a comment or post
                            </p>
                          </div>
                          <Switch
                            id="mention-notifications"
                            checked={notificationSettings.mentionNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                mentionNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="message-notifications">Direct Messages</Label>
                            <p className="text-sm text-muted-foreground">
                              When you receive a new direct message
                            </p>
                          </div>
                          <Switch
                            id="message-notifications"
                            checked={notificationSettings.newMessageNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                newMessageNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="forum-notifications">Forum Activity</Label>
                            <p className="text-sm text-muted-foreground">
                              Replies to your discussions and topics you follow
                            </p>
                          </div>
                          <Switch
                            id="forum-notifications"
                            checked={notificationSettings.forumNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                forumNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="system-notifications">System Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Important announcements and system updates
                            </p>
                          </div>
                          <Switch
                            id="system-notifications"
                            checked={notificationSettings.systemNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                systemNotifications: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Do Not Disturb</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="do-not-disturb">Do Not Disturb Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Temporarily mute all notifications and sounds
                            </p>
                          </div>
                          <Switch
                            id="do-not-disturb"
                            checked={user?.status === 'do-not-disturb'}
                            onCheckedChange={(checked) =>
                              updateUserStatus(checked ? 'do-not-disturb' : 'online')
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button">Reset to Default</Button>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control who can see your information and activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="online-status">Online Status</Label>
                          <p className="text-sm text-muted-foreground">
                            Show others when you're online
                          </p>
                        </div>
                        <Switch
                          id="online-status"
                          checked={privacySettings.showOnlineStatus}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              showOnlineStatus: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="last-seen">Last Seen</Label>
                          <p className="text-sm text-muted-foreground">
                            Show when you were last active
                          </p>
                        </div>
                        <Switch
                          id="last-seen"
                          checked={privacySettings.showLastSeen}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              showLastSeen: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reading-activity">Reading Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Show others what content you're currently reading
                          </p>
                        </div>
                        <Switch
                          id="reading-activity"
                          checked={privacySettings.showReadingActivity}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              showReadingActivity: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Communication</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="direct-messages">Direct Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to send you direct messages
                          </p>
                        </div>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Everyone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="following">Following Only</SelectItem>
                            <SelectItem value="nobody">Nobody</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ghost Mode</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="ghost-mode">Invisible Browsing</Label>
                          <p className="text-sm text-muted-foreground">
                            Browse without appearing in 'Currently Online' lists
                          </p>
                        </div>
                        <Switch
                          id="ghost-mode"
                          checked={user?.isGhostMode}
                          onCheckedChange={() => toggleGhostMode()}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and login options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button type="button">Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="two-factor" disabled />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Two-factor authentication is coming soon. Stay tuned for updates.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>
                    <p className="text-sm text-muted-foreground">
                      You're currently signed in on this device. To sign out of other devices, click below.
                    </p>
                    <Button variant="outline">
                      Sign Out From All Other Devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
