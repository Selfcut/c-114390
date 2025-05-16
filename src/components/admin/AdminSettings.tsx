
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

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
  maintenanceMode: false
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

        // In a real application, this would fetch from a database
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
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

      // In a real application, this would save to a database
      localStorage.setItem('adminSettings', JSON.stringify(settings));

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
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
                <Input 
                  id="defaultUserRole" 
                  value={settings.defaultUserRole}
                  onChange={(e) => setSettings({...settings, defaultUserRole: e.target.value})}
                  disabled
                />
                <p className="text-xs text-muted-foreground">This setting is controlled by the database configuration</p>
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
              <Alert variant="warning">
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
        
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </Tabs>
    </div>
  );
};
