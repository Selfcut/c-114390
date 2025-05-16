
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSiteSettings } from '@/hooks/use-site-settings';

// Import individual settings components
import { GeneralSettings } from './settings/GeneralSettings';
import { ContentSettings } from './settings/ContentSettings';
import { UserSettings } from './settings/UserSettings';
import { WikiSettings } from './settings/WikiSettings';
import { ForumSettings } from './settings/ForumSettings';
import { ChatSettings } from './settings/ChatSettings';
import { AdvancedSettings } from './settings/AdvancedSettings';

export const AdminSettings = () => {
  const { 
    settings, 
    isLoading, 
    isSaving, 
    error, 
    saveSettings, 
    resetSettings, 
    updateSetting,
    updateNestedSetting
  } = useSiteSettings();

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
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <GeneralSettings 
              settings={settings} 
              updateSetting={updateSetting} 
            />
          </TabsContent>
          
          {/* Content Settings Tab */}
          <TabsContent value="content">
            <ContentSettings 
              settings={settings} 
              updateSetting={updateSetting} 
            />
          </TabsContent>
          
          {/* User Settings Tab */}
          <TabsContent value="users">
            <UserSettings 
              settings={settings} 
              updateSetting={updateSetting} 
              updateNestedSetting={updateNestedSetting} 
            />
          </TabsContent>

          {/* Wiki Settings Tab */}
          <TabsContent value="wiki">
            <WikiSettings 
              settings={settings} 
              updateNestedSetting={updateNestedSetting} 
            />
          </TabsContent>

          {/* Forum Settings Tab */}
          <TabsContent value="forum">
            <ForumSettings 
              settings={settings} 
              updateNestedSetting={updateNestedSetting} 
            />
          </TabsContent>

          {/* Chat Settings Tab */}
          <TabsContent value="chat">
            <ChatSettings 
              settings={settings} 
              updateNestedSetting={updateNestedSetting} 
            />
          </TabsContent>
          
          {/* Advanced Settings Tab */}
          <TabsContent value="advanced">
            <AdvancedSettings 
              settings={settings} 
              updateSetting={updateSetting} 
            />
          </TabsContent>
          
          <div className="flex justify-end mt-6 gap-2 sticky bottom-0 pb-4 pt-2 bg-background">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
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
