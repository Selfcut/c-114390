
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  RefreshCcw, 
  Settings, 
  Layers, 
  FileText, 
  Image,
  Upload,
  Link,
  Palette,
  Sparkles,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Polymath Platform",
    siteDescription: "A knowledge-sharing and learning community for interdisciplinary thinkers",
    siteUrl: "https://polymath-platform.com",
    supportEmail: "support@polymath-platform.com",
    maintenanceMode: false,
    inviteOnly: false
  });
  
  // Content Settings
  const [contentSettings, setSiteContentSettings] = useState({
    maxPostTitleLength: 100,
    maxPostContentLength: 5000,
    maxCommentLength: 1000,
    allowedFileSizeInMB: 10,
    allowImages: true,
    allowVideos: true,
    allowDocuments: true,
    allowExternalLinks: true,
    requireApproval: false
  });
  
  // User Settings
  const [userSettings, setUserSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    maxSessionLengthDays: 30,
    defaultUserRole: "user",
    allowMultipleLogins: true,
    lockoutAttempts: 5
  });
  
  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalyticsId: "",
    recaptchaSiteKey: "",
    mailchimpApiKey: "",
    enableSocialLogins: false,
    enableGoogleLogin: false,
    enableGithubLogin: false,
    enableTwitterLogin: false
  });
  
  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    defaultTheme: "dark",
    primaryColor: "#9b87f5",
    secondaryColor: "#7E69AB",
    accentColor: "#6E59A5",
    customCss: "",
    customHeader: "",
    customFooter: ""
  });
  
  // Media Settings
  const [mediaSettings, setMediaSettings] = useState({
    maxImageSizeMB: 5,
    maxVideoSizeMB: 50,
    maxDocumentSizeMB: 20,
    allowedImageFormats: "jpg,jpeg,png,gif,webp",
    allowedVideoFormats: "mp4,webm,ogg",
    allowedDocumentFormats: "pdf,doc,docx,xls,xlsx,ppt,pptx,txt",
    storageProvider: "supabase"
  });

  // Handle site settings submit
  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // In a real app, store these settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Site settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Something went wrong while saving the settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle content settings submit
  const handleContentSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // In a real app, store these settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Content settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Something went wrong while saving the settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle user settings submit
  const handleUserSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // In a real app, store these settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "User settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Something went wrong while saving the settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle integration settings submit
  const handleIntegrationSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // In a real app, store these settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Integration settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Something went wrong while saving the settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle appearance settings submit
  const handleAppearanceSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // In a real app, store these settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Appearance settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Something went wrong while saving the settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle media settings submit
  const handleMediaSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // In a real app, store these settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Media settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Something went wrong while saving the settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Make user an admin
  const makeUserAdmin = async () => {
    try {
      setIsSaving(true);
      
      const userId = "dc7bedf3-14c3-4376-adfb-de5ac8207adc";
      
      // Update user role in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      // Add user to admin roles table if it exists
      try {
        await supabase
          .from('user_roles')
          .upsert(
            { user_id: userId, role: 'admin' },
            { onConflict: 'user_id,role' }
          );
      } catch (roleError) {
        console.log("No user_roles table exists:", roleError);
      }
      
      toast({
        title: "Admin access granted",
        description: "User has been granted admin privileges",
      });
    } catch (error) {
      console.error("Error granting admin access:", error);
      toast({
        title: "Error granting admin access",
        description: "Something went wrong while granting admin privileges",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
        <CardDescription>
          Configure and customize the Polymath platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="site">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="site">Site</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          
          {/* Site Settings */}
          <TabsContent value="site" className="py-4">
            <form onSubmit={handleSiteSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={siteSettings.siteName} 
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input 
                    id="siteUrl" 
                    value={siteSettings.siteUrl} 
                    onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea 
                    id="siteDescription" 
                    value={siteSettings.siteDescription} 
                    onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input 
                    id="supportEmail" 
                    type="email"
                    value={siteSettings.supportEmail} 
                    onChange={(e) => setSiteSettings({...siteSettings, supportEmail: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Special Actions</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={makeUserAdmin}
                      disabled={isSaving}
                    >
                      Make User Admin
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Cache cleared",
                          description: "System cache has been cleared",
                        });
                      }}
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <Label htmlFor="maintenanceMode" className="mb-1">Maintenance Mode</Label>
                  <span className="text-xs text-muted-foreground">Make the site unavailable for regular users</span>
                </div>
                <Switch 
                  id="maintenanceMode" 
                  checked={siteSettings.maintenanceMode}
                  onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenanceMode: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <Label htmlFor="inviteOnly" className="mb-1">Invite Only</Label>
                  <span className="text-xs text-muted-foreground">Restrict registrations to invited users only</span>
                </div>
                <Switch 
                  id="inviteOnly" 
                  checked={siteSettings.inviteOnly}
                  onCheckedChange={(checked) => setSiteSettings({...siteSettings, inviteOnly: checked})}
                />
              </div>
              
              <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          {/* Content Settings */}
          <TabsContent value="content" className="py-4">
            <form onSubmit={handleContentSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxPostTitleLength">Maximum Post Title Length</Label>
                  <Input 
                    id="maxPostTitleLength" 
                    type="number"
                    value={contentSettings.maxPostTitleLength} 
                    onChange={(e) => setSiteContentSettings({...contentSettings, maxPostTitleLength: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPostContentLength">Maximum Post Content Length</Label>
                  <Input 
                    id="maxPostContentLength" 
                    type="number"
                    value={contentSettings.maxPostContentLength} 
                    onChange={(e) => setSiteContentSettings({...contentSettings, maxPostContentLength: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxCommentLength">Maximum Comment Length</Label>
                  <Input 
                    id="maxCommentLength" 
                    type="number"
                    value={contentSettings.maxCommentLength} 
                    onChange={(e) => setSiteContentSettings({...contentSettings, maxCommentLength: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedFileSizeInMB">Maximum File Size (MB)</Label>
                  <Input 
                    id="allowedFileSizeInMB" 
                    type="number"
                    value={contentSettings.allowedFileSizeInMB} 
                    onChange={(e) => setSiteContentSettings({...contentSettings, allowedFileSizeInMB: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="allowImages" className="mb-1">Allow Images</Label>
                    <span className="text-xs text-muted-foreground">Enable uploading and embedding of images</span>
                  </div>
                  <Switch 
                    id="allowImages" 
                    checked={contentSettings.allowImages}
                    onCheckedChange={(checked) => setSiteContentSettings({...contentSettings, allowImages: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="allowVideos" className="mb-1">Allow Videos</Label>
                    <span className="text-xs text-muted-foreground">Enable uploading and embedding of videos</span>
                  </div>
                  <Switch 
                    id="allowVideos" 
                    checked={contentSettings.allowVideos}
                    onCheckedChange={(checked) => setSiteContentSettings({...contentSettings, allowVideos: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="allowDocuments" className="mb-1">Allow Documents</Label>
                    <span className="text-xs text-muted-foreground">Enable uploading and sharing of documents</span>
                  </div>
                  <Switch 
                    id="allowDocuments" 
                    checked={contentSettings.allowDocuments}
                    onCheckedChange={(checked) => setSiteContentSettings({...contentSettings, allowDocuments: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="allowExternalLinks" className="mb-1">Allow External Links</Label>
                    <span className="text-xs text-muted-foreground">Enable embedding of external links</span>
                  </div>
                  <Switch 
                    id="allowExternalLinks" 
                    checked={contentSettings.allowExternalLinks}
                    onCheckedChange={(checked) => setSiteContentSettings({...contentSettings, allowExternalLinks: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="requireApproval" className="mb-1">Require Content Approval</Label>
                    <span className="text-xs text-muted-foreground">Require admin approval before content is published</span>
                  </div>
                  <Switch 
                    id="requireApproval" 
                    checked={contentSettings.requireApproval}
                    onCheckedChange={(checked) => setSiteContentSettings({...contentSettings, requireApproval: checked})}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          {/* User Settings */}
          <TabsContent value="users" className="py-4">
            <form onSubmit={handleUserSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxSessionLengthDays">Session Length (Days)</Label>
                  <Input 
                    id="maxSessionLengthDays" 
                    type="number"
                    value={userSettings.maxSessionLengthDays} 
                    onChange={(e) => setUserSettings({...userSettings, maxSessionLengthDays: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lockoutAttempts">Failed Login Attempts Before Lockout</Label>
                  <Input 
                    id="lockoutAttempts" 
                    type="number"
                    value={userSettings.lockoutAttempts} 
                    onChange={(e) => setUserSettings({...userSettings, lockoutAttempts: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultUserRole">Default User Role</Label>
                  <select
                    id="defaultUserRole"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={userSettings.defaultUserRole}
                    onChange={(e) => setUserSettings({...userSettings, defaultUserRole: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="contributor">Contributor</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="allowRegistration" className="mb-1">Allow Registration</Label>
                    <span className="text-xs text-muted-foreground">Enable new user registrations</span>
                  </div>
                  <Switch 
                    id="allowRegistration" 
                    checked={userSettings.allowRegistration}
                    onCheckedChange={(checked) => setUserSettings({...userSettings, allowRegistration: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="requireEmailVerification" className="mb-1">Require Email Verification</Label>
                    <span className="text-xs text-muted-foreground">Users must verify email before they can log in</span>
                  </div>
                  <Switch 
                    id="requireEmailVerification" 
                    checked={userSettings.requireEmailVerification}
                    onCheckedChange={(checked) => setUserSettings({...userSettings, requireEmailVerification: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="allowMultipleLogins" className="mb-1">Allow Multiple Sessions</Label>
                    <span className="text-xs text-muted-foreground">Allow users to be logged in on multiple devices</span>
                  </div>
                  <Switch 
                    id="allowMultipleLogins" 
                    checked={userSettings.allowMultipleLogins}
                    onCheckedChange={(checked) => setUserSettings({...userSettings, allowMultipleLogins: checked})}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          {/* Integration Settings */}
          <TabsContent value="integrations" className="py-4">
            <form onSubmit={handleIntegrationSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input 
                    id="googleAnalyticsId" 
                    value={integrationSettings.googleAnalyticsId} 
                    onChange={(e) => setIntegrationSettings({...integrationSettings, googleAnalyticsId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recaptchaSiteKey">Google reCAPTCHA Site Key</Label>
                  <Input 
                    id="recaptchaSiteKey" 
                    value={integrationSettings.recaptchaSiteKey} 
                    onChange={(e) => setIntegrationSettings({...integrationSettings, recaptchaSiteKey: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mailchimpApiKey">Mailchimp API Key</Label>
                  <Input 
                    id="mailchimpApiKey" 
                    value={integrationSettings.mailchimpApiKey} 
                    onChange={(e) => setIntegrationSettings({...integrationSettings, mailchimpApiKey: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label htmlFor="enableSocialLogins" className="mb-1">Enable Social Logins</Label>
                    <span className="text-xs text-muted-foreground">Enable authentication with social media accounts</span>
                  </div>
                  <Switch 
                    id="enableSocialLogins" 
                    checked={integrationSettings.enableSocialLogins}
                    onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableSocialLogins: checked})}
                  />
                </div>
                
                {integrationSettings.enableSocialLogins && (
                  <div className="pl-6 space-y-4 border-l-2 border-muted">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableGoogleLogin">Google Login</Label>
                      <Switch 
                        id="enableGoogleLogin" 
                        checked={integrationSettings.enableGoogleLogin}
                        onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableGoogleLogin: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableGithubLogin">GitHub Login</Label>
                      <Switch 
                        id="enableGithubLogin" 
                        checked={integrationSettings.enableGithubLogin}
                        onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableGithubLogin: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableTwitterLogin">Twitter Login</Label>
                      <Switch 
                        id="enableTwitterLogin" 
                        checked={integrationSettings.enableTwitterLogin}
                        onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableTwitterLogin: checked})}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="py-4">
            <form onSubmit={handleAppearanceSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTheme">Default Theme</Label>
                  <select
                    id="defaultTheme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={appearanceSettings.defaultTheme}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, defaultTheme: e.target.value})}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      id="primaryColor"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                      className="w-10 h-10 rounded"
                    />
                    <Input 
                      value={appearanceSettings.primaryColor} 
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      id="secondaryColor"
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                      className="w-10 h-10 rounded"
                    />
                    <Input 
                      value={appearanceSettings.secondaryColor} 
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      id="accentColor"
                      value={appearanceSettings.accentColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, accentColor: e.target.value})}
                      className="w-10 h-10 rounded"
                    />
                    <Input 
                      value={appearanceSettings.accentColor} 
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, accentColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <Textarea 
                    id="customCss" 
                    value={appearanceSettings.customCss} 
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, customCss: e.target.value})}
                    placeholder="/* Add your custom CSS here */"
                    className="font-mono h-32"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customHeader">Custom Header HTML</Label>
                  <Textarea 
                    id="customHeader" 
                    value={appearanceSettings.customHeader} 
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, customHeader: e.target.value})}
                    placeholder="<!-- Add custom HTML for the header -->"
                    className="font-mono h-32"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customFooter">Custom Footer HTML</Label>
                  <Textarea 
                    id="customFooter" 
                    value={appearanceSettings.customFooter} 
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, customFooter: e.target.value})}
                    placeholder="<!-- Add custom HTML for the footer -->"
                    className="font-mono h-32"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Palette className="mr-2 h-4 w-4" />
                      Save Appearance
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          {/* Media Settings */}
          <TabsContent value="media" className="py-4">
            <form onSubmit={handleMediaSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxImageSizeMB">Max Image Size (MB)</Label>
                  <Input 
                    id="maxImageSizeMB" 
                    type="number"
                    value={mediaSettings.maxImageSizeMB} 
                    onChange={(e) => setMediaSettings({...mediaSettings, maxImageSizeMB: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxVideoSizeMB">Max Video Size (MB)</Label>
                  <Input 
                    id="maxVideoSizeMB" 
                    type="number"
                    value={mediaSettings.maxVideoSizeMB} 
                    onChange={(e) => setMediaSettings({...mediaSettings, maxVideoSizeMB: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxDocumentSizeMB">Max Document Size (MB)</Label>
                  <Input 
                    id="maxDocumentSizeMB" 
                    type="number"
                    value={mediaSettings.maxDocumentSizeMB} 
                    onChange={(e) => setMediaSettings({...mediaSettings, maxDocumentSizeMB: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storageProvider">Storage Provider</Label>
                  <select
                    id="storageProvider"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={mediaSettings.storageProvider}
                    onChange={(e) => setMediaSettings({...mediaSettings, storageProvider: e.target.value})}
                  >
                    <option value="supabase">Supabase Storage</option>
                    <option value="s3">Amazon S3</option>
                    <option value="local">Local Storage</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedImageFormats">Allowed Image Formats</Label>
                  <Input 
                    id="allowedImageFormats" 
                    value={mediaSettings.allowedImageFormats} 
                    onChange={(e) => setMediaSettings({...mediaSettings, allowedImageFormats: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Comma separated list of extensions</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedVideoFormats">Allowed Video Formats</Label>
                  <Input 
                    id="allowedVideoFormats" 
                    value={mediaSettings.allowedVideoFormats} 
                    onChange={(e) => setMediaSettings({...mediaSettings, allowedVideoFormats: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Comma separated list of extensions</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="allowedDocumentFormats">Allowed Document Formats</Label>
                  <Input 
                    id="allowedDocumentFormats" 
                    value={mediaSettings.allowedDocumentFormats} 
                    onChange={(e) => setMediaSettings({...mediaSettings, allowedDocumentFormats: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Comma separated list of extensions</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Save Media Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
