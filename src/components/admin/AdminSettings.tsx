import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ShieldAlert, Globe, Upload, Mail, Bell, Key, Lock, Database, FileText, MessageSquare } from "lucide-react";

export const AdminSettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // General settings
  const [siteName, setSiteName] = useState("Polymath Platform");
  const [siteDescription, setSiteDescription] = useState("A platform for sharing and connecting knowledge");
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  
  // Content settings
  const [maxTitleLength, setMaxTitleLength] = useState(100);
  const [maxContentLength, setMaxContentLength] = useState(5000);
  const [maxFileSize, setMaxFileSize] = useState(10);
  const [allowedMediaTypes, setAllowedMediaTypes] = useState({
    image: true,
    video: true,
    document: true,
    youtube: true
  });
  
  // User settings
  const [defaultUserRole, setDefaultUserRole] = useState("user");
  const [autoApproveUsers, setAutoApproveUsers] = useState(true);
  const [userProfileFields, setUserProfileFields] = useState({
    bio: true,
    website: true,
    location: false,
    socialLinks: false
  });
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationEvents, setNotificationEvents] = useState({
    newComment: true,
    newFollower: true,
    contentMention: true,
    systemAnnouncement: true
  });

  const handleSaveSettings = async (tab: string) => {
    setIsSubmitting(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Settings saved",
        description: `${tab} settings have been updated successfully.`
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="text-muted-foreground">
            Configure global settings for the Polymath platform
          </p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-64 flex-shrink-0">
            <CardContent className="p-4">
              <TabsList className="flex flex-col items-start w-full">
                <TabsTrigger value="general" className="w-full justify-start mb-1 gap-2">
                  <Globe size={16} />
                  <span>General</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="w-full justify-start mb-1 gap-2">
                  <FileText size={16} />
                  <span>Content</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="w-full justify-start mb-1 gap-2">
                  <Key size={16} />
                  <span>Users & Access</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start mb-1 gap-2">
                  <Bell size={16} />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="moderation" className="w-full justify-start mb-1 gap-2">
                  <ShieldAlert size={16} />
                  <span>Moderation</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="w-full justify-start mb-1 gap-2">
                  <Database size={16} />
                  <span>Performance</span>
                </TabsTrigger>
                <TabsTrigger value="backup" className="w-full justify-start mb-1 gap-2">
                  <Lock size={16} />
                  <span>Backup & Security</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <div className="flex-1">
            <TabsContent value="general" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure basic platform settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Platform Name</Label>
                      <Input
                        id="siteName"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Platform Description</Label>
                      <Input
                        id="siteDescription"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="registration">Allow User Registration</Label>
                        <Switch
                          id="registration"
                          checked={allowRegistration}
                          onCheckedChange={setAllowRegistration}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        If disabled, new users cannot register on the platform
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailVerification">Require Email Verification</Label>
                        <Switch
                          id="emailVerification"
                          checked={requireEmailVerification}
                          onCheckedChange={setRequireEmailVerification}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Users must verify their email address before accessing the platform
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleSaveSettings('General')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>
                    Configure content creation and media settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maxTitleLength">Maximum Title Length: {maxTitleLength} characters</Label>
                      </div>
                      <Slider
                        id="maxTitleLength"
                        min={50}
                        max={200}
                        step={10}
                        value={[maxTitleLength]}
                        onValueChange={([value]) => setMaxTitleLength(value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maxContentLength">Maximum Content Length: {maxContentLength} characters</Label>
                      </div>
                      <Slider
                        id="maxContentLength"
                        min={1000}
                        max={10000}
                        step={500}
                        value={[maxContentLength]}
                        onValueChange={([value]) => setMaxContentLength(value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maxFileSize">Maximum File Upload Size: {maxFileSize} MB</Label>
                      </div>
                      <Slider
                        id="maxFileSize"
                        min={1}
                        max={50}
                        step={1}
                        value={[maxFileSize]}
                        onValueChange={([value]) => setMaxFileSize(value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Allowed Media Types</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant={allowedMediaTypes.image ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => setAllowedMediaTypes({
                            ...allowedMediaTypes,
                            image: !allowedMediaTypes.image
                          })}
                        >
                          Images
                        </Badge>
                        <Badge 
                          variant={allowedMediaTypes.video ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => setAllowedMediaTypes({
                            ...allowedMediaTypes,
                            video: !allowedMediaTypes.video
                          })}
                        >
                          Videos
                        </Badge>
                        <Badge 
                          variant={allowedMediaTypes.document ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => setAllowedMediaTypes({
                            ...allowedMediaTypes,
                            document: !allowedMediaTypes.document
                          })}
                        >
                          Documents
                        </Badge>
                        <Badge 
                          variant={allowedMediaTypes.youtube ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => setAllowedMediaTypes({
                            ...allowedMediaTypes,
                            youtube: !allowedMediaTypes.youtube
                          })}
                        >
                          YouTube Links
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click to toggle allowed media types
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleSaveSettings('Content')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Users & Access Settings</CardTitle>
                  <CardDescription>
                    Configure user accounts and access control
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultRole">Default User Role</Label>
                      <Select value={defaultUserRole} onValueChange={setDefaultUserRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="contributor">Contributor</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoApprove">Auto-approve New Users</Label>
                        <Switch
                          id="autoApprove"
                          checked={autoApproveUsers}
                          onCheckedChange={setAutoApproveUsers}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        If disabled, new users will require admin approval
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>User Profile Fields</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="bioField" className="cursor-pointer">Bio</Label>
                          <Switch
                            id="bioField"
                            checked={userProfileFields.bio}
                            onCheckedChange={(checked) => setUserProfileFields({
                              ...userProfileFields,
                              bio: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="websiteField" className="cursor-pointer">Website</Label>
                          <Switch
                            id="websiteField"
                            checked={userProfileFields.website}
                            onCheckedChange={(checked) => setUserProfileFields({
                              ...userProfileFields,
                              website: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="locationField" className="cursor-pointer">Location</Label>
                          <Switch
                            id="locationField"
                            checked={userProfileFields.location}
                            onCheckedChange={(checked) => setUserProfileFields({
                              ...userProfileFields,
                              location: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="socialField" className="cursor-pointer">Social Media Links</Label>
                          <Switch
                            id="socialField"
                            checked={userProfileFields.socialLinks}
                            onCheckedChange={(checked) => setUserProfileFields({
                              ...userProfileFields,
                              socialLinks: checked
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleSaveSettings('User')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure platform notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <Switch
                          id="emailNotifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Send notification emails to users
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <Switch
                          id="pushNotifications"
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable browser push notifications
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Notification Events</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="newComment" className="cursor-pointer">New Comments</Label>
                          <Switch
                            id="newComment"
                            checked={notificationEvents.newComment}
                            onCheckedChange={(checked) => setNotificationEvents({
                              ...notificationEvents,
                              newComment: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="newFollower" className="cursor-pointer">New Followers</Label>
                          <Switch
                            id="newFollower"
                            checked={notificationEvents.newFollower}
                            onCheckedChange={(checked) => setNotificationEvents({
                              ...notificationEvents,
                              newFollower: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="contentMention" className="cursor-pointer">Content Mentions</Label>
                          <Switch
                            id="contentMention"
                            checked={notificationEvents.contentMention}
                            onCheckedChange={(checked) => setNotificationEvents({
                              ...notificationEvents,
                              contentMention: checked
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="systemAnnouncement" className="cursor-pointer">System Announcements</Label>
                          <Switch
                            id="systemAnnouncement"
                            checked={notificationEvents.systemAnnouncement}
                            onCheckedChange={(checked) => setNotificationEvents({
                              ...notificationEvents,
                              systemAnnouncement: checked
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleSaveSettings('Notification')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="moderation" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Moderation Settings</CardTitle>
                  <CardDescription>
                    Configure content moderation settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <p>Moderation settings will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                  <CardDescription>
                    Configure system performance settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <p>Performance settings will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="backup" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Backup & Security Settings</CardTitle>
                  <CardDescription>
                    Configure backup and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <p>Backup & Security settings will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
