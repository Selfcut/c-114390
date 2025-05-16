import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Json } from '@/integrations/supabase/types';

interface SiteSettings {
  enableUserRegistration: boolean;
  enableWikiCreation: boolean;
  enableMediaUploads: boolean;
  enableComments: boolean;
  defaultUserRole: string;
  maxFileSize: number;
  maxTitleLength: number;
  maxContentLength: number;
  siteName: string;
  siteDescription: string;
  allowedMediaTypes: string[];
  maintenanceMode: boolean;
  contentModeration: boolean;
  autoApproveContent: boolean;
  wikiEditorOptions: {
    allowImages: boolean;
    allowVideos: boolean;
    allowLinks: boolean;
    maxImageSize: number;
  };
  userLimitations: {
    maxPostsPerDay: number;
    maxUploadsPerDay: number;
    maxCommentsPerDay: number;
  };
  forumSettings: {
    enableThreads: boolean;
    maxThreadLength: number;
    allowAnonymousPosts: boolean;
  };
  chatSettings: {
    enableGlobalChat: boolean;
    enablePrivateMessages: boolean;
    messageRetentionDays: number;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  enableUserRegistration: true,
  enableWikiCreation: true,
  enableMediaUploads: true,
  enableComments: true,
  defaultUserRole: 'user',
  maxFileSize: 10, // MB
  maxTitleLength: 100,
  maxContentLength: 10000,
  siteName: 'Polymath Platform',
  siteDescription: 'A platform for sharing knowledge and media',
  allowedMediaTypes: ['image/*', 'video/*', 'application/pdf', 'audio/*'],
  maintenanceMode: false,
  contentModeration: true,
  autoApproveContent: false,
  wikiEditorOptions: {
    allowImages: true,
    allowVideos: true,
    allowLinks: true,
    maxImageSize: 5, // MB
  },
  userLimitations: {
    maxPostsPerDay: 10,
    maxUploadsPerDay: 20,
    maxCommentsPerDay: 50,
  },
  forumSettings: {
    enableThreads: true,
    maxThreadLength: 500,
    allowAnonymousPosts: false,
  },
  chatSettings: {
    enableGlobalChat: true,
    enablePrivateMessages: true,
    messageRetentionDays: 30,
  }
};

export const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from database or local storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to load from Supabase if available
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .single();

        if (error) {
          console.error('Error loading settings from database:', error);
          // Fall back to localStorage
          const savedSettings = localStorage.getItem('adminSettings');
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        } else if (data && data.settings) {
          // Type assertion to safely convert Json to SiteSettings
          const loadedSettings = data.settings as Record<string, any>;
          
          // Create a new settings object with defaults + loaded values
          const mergedSettings: SiteSettings = {
            ...DEFAULT_SETTINGS,
            ...loadedSettings
          };
          
          setSettings(mergedSettings);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Try to save to Supabase
      try {
        // Convert the settings object to a JSON compatible object
        const settingsJson = JSON.parse(JSON.stringify(settings)) as Json;
        
        const { error } = await supabase
          .from('site_settings')
          .upsert({ 
            id: 'global', 
            settings: settingsJson,
            updated_at: new Date().toISOString() 
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error saving to database, using localStorage instead:', err);
        // Fall back to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(settings));
      }

      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      toast({
        title: "Error",
        description: "There was a problem saving your settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    });
  };

  const updateNestedSetting = (category: keyof SiteSettings, key: string, value: any) => {
    if (typeof settings[category] === 'object' && !Array.isArray(settings[category])) {
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="wiki">Wiki</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    placeholder="Enter site name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input 
                    id="siteDescription" 
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    placeholder="Enter site description"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Disable the site for maintenance
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="contentModeration">Content Moderation</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable content moderation for all posts
                    </p>
                  </div>
                  <Switch
                    id="contentModeration"
                    checked={settings.contentModeration}
                    onCheckedChange={(checked) => setSettings({...settings, contentModeration: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Settings */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>Configure content creation and sharing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="maxTitleLength">Maximum Title Length</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="maxTitleLength" 
                      type="number"
                      value={settings.maxTitleLength}
                      onChange={(e) => setSettings({...settings, maxTitleLength: Number(e.target.value)})}
                    />
                    <span className="text-sm text-muted-foreground">characters</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxContentLength">Maximum Content Length</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="maxContentLength" 
                      type="number"
                      value={settings.maxContentLength}
                      onChange={(e) => setSettings({...settings, maxContentLength: Number(e.target.value)})}
                    />
                    <span className="text-sm text-muted-foreground">characters</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Maximum File Size</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="maxFileSize" 
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => setSettings({...settings, maxFileSize: Number(e.target.value)})}
                    />
                    <span className="text-sm text-muted-foreground">MB</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoApproveContent">Auto-Approve Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve user-submitted content
                    </p>
                  </div>
                  <Switch
                    id="autoApproveContent"
                    checked={settings.autoApproveContent}
                    onCheckedChange={(checked) => setSettings({...settings, autoApproveContent: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableWikiCreation">Enable Wiki Creation</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to create wiki articles
                    </p>
                  </div>
                  <Switch
                    id="enableWikiCreation"
                    checked={settings.enableWikiCreation}
                    onCheckedChange={(checked) => setSettings({...settings, enableWikiCreation: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableMediaUploads">Enable Media Uploads</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to upload media content
                    </p>
                  </div>
                  <Switch
                    id="enableMediaUploads"
                    checked={settings.enableMediaUploads}
                    onCheckedChange={(checked) => setSettings({...settings, enableMediaUploads: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableComments">Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to comment on content
                    </p>
                  </div>
                  <Switch
                    id="enableComments"
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => setSettings({...settings, enableComments: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* User Settings */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>Configure user account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableUserRegistration">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register accounts
                    </p>
                  </div>
                  <Switch
                    id="enableUserRegistration"
                    checked={settings.enableUserRegistration}
                    onCheckedChange={(checked) => setSettings({...settings, enableUserRegistration: checked})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultUserRole">Default User Role</Label>
                  <Select 
                    value={settings.defaultUserRole} 
                    onValueChange={(value) => setSettings({...settings, defaultUserRole: value})}
                  >
                    <SelectTrigger id="defaultUserRole">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />
                
                <h3 className="text-lg font-medium">Daily User Limits</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPostsPerDay">Maximum Posts Per Day</Label>
                  <Input
                    id="maxPostsPerDay"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.userLimitations.maxPostsPerDay}
                    onChange={(e) => updateNestedSetting('userLimitations', 'maxPostsPerDay', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUploadsPerDay">Maximum Uploads Per Day</Label>
                  <Input
                    id="maxUploadsPerDay"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.userLimitations.maxUploadsPerDay}
                    onChange={(e) => updateNestedSetting('userLimitations', 'maxUploadsPerDay', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxCommentsPerDay">Maximum Comments Per Day</Label>
                  <Input
                    id="maxCommentsPerDay"
                    type="number"
                    min="1"
                    max="500"
                    value={settings.userLimitations.maxCommentsPerDay}
                    onChange={(e) => updateNestedSetting('userLimitations', 'maxCommentsPerDay', parseInt(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wiki Settings */}
          <TabsContent value="wiki">
            <Card>
              <CardHeader>
                <CardTitle>Wiki Settings</CardTitle>
                <CardDescription>Configure wiki feature settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowWikiImages">Allow Images in Wiki</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to include images in wiki articles
                    </p>
                  </div>
                  <Switch
                    id="allowWikiImages"
                    checked={settings.wikiEditorOptions.allowImages}
                    onCheckedChange={(checked) => updateNestedSetting('wikiEditorOptions', 'allowImages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowWikiVideos">Allow Videos in Wiki</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to embed videos in wiki articles
                    </p>
                  </div>
                  <Switch
                    id="allowWikiVideos"
                    checked={settings.wikiEditorOptions.allowVideos}
                    onCheckedChange={(checked) => updateNestedSetting('wikiEditorOptions', 'allowVideos', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowWikiLinks">Allow External Links</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to include external links in wiki articles
                    </p>
                  </div>
                  <Switch
                    id="allowWikiLinks"
                    checked={settings.wikiEditorOptions.allowLinks}
                    onCheckedChange={(checked) => updateNestedSetting('wikiEditorOptions', 'allowLinks', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxWikiImageSize">Maximum Wiki Image Size (MB)</Label>
                  <Input
                    id="maxWikiImageSize"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.wikiEditorOptions.maxImageSize}
                    onChange={(e) => updateNestedSetting('wikiEditorOptions', 'maxImageSize', parseInt(e.target.value) || 1)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forum Settings */}
          <TabsContent value="forum">
            <Card>
              <CardHeader>
                <CardTitle>Forum Settings</CardTitle>
                <CardDescription>Configure forum feature settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableThreads">Enable Discussion Threads</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow threaded discussions in the forum
                    </p>
                  </div>
                  <Switch
                    id="enableThreads"
                    checked={settings.forumSettings.enableThreads}
                    onCheckedChange={(checked) => updateNestedSetting('forumSettings', 'enableThreads', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxThreadLength">Maximum Thread Length</Label>
                  <Input
                    id="maxThreadLength"
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.forumSettings.maxThreadLength}
                    onChange={(e) => updateNestedSetting('forumSettings', 'maxThreadLength', parseInt(e.target.value) || 500)}
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of characters in a forum post</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowAnonymousPosts">Allow Anonymous Posts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to post anonymously in the forum
                    </p>
                  </div>
                  <Switch
                    id="allowAnonymousPosts"
                    checked={settings.forumSettings.allowAnonymousPosts}
                    onCheckedChange={(checked) => updateNestedSetting('forumSettings', 'allowAnonymousPosts', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Settings */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat Settings</CardTitle>
                <CardDescription>Configure chat feature settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableGlobalChat">Enable Global Chat</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable the platform-wide chat channel
                    </p>
                  </div>
                  <Switch
                    id="enableGlobalChat"
                    checked={settings.chatSettings.enableGlobalChat}
                    onCheckedChange={(checked) => updateNestedSetting('chatSettings', 'enableGlobalChat', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enablePrivateMessages">Enable Private Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to send private messages
                    </p>
                  </div>
                  <Switch
                    id="enablePrivateMessages"
                    checked={settings.chatSettings.enablePrivateMessages}
                    onCheckedChange={(checked) => updateNestedSetting('chatSettings', 'enablePrivateMessages', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messageRetentionDays">Message Retention Period (Days)</Label>
                  <Input
                    id="messageRetentionDays"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.chatSettings.messageRetentionDays}
                    onChange={(e) => updateNestedSetting('chatSettings', 'messageRetentionDays', parseInt(e.target.value) || 30)}
                  />
                  <p className="text-xs text-muted-foreground">Number of days to keep chat messages before deletion</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced platform settings (use with caution)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>Changing these settings may affect system stability</AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedMediaTypes">Allowed Media Types</Label>
                  <Input 
                    id="allowedMediaTypes" 
                    value={settings.allowedMediaTypes.join(', ')}
                    onChange={(e) => setSettings({
                      ...settings, 
                      allowedMediaTypes: e.target.value.split(',').map(type => type.trim())
                    })}
                    placeholder="image/*, video/*, etc."
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated list of allowed MIME types</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="flex justify-end mt-6 gap-2 sticky bottom-0 pb-4 pt-2 bg-background">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default AdminSettings;
