
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCcw, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Polymath Community",
    siteDescription: "A platform for interdisciplinary thinking and intellectual exchange",
    siteLogo: "/logo.svg",
    contactEmail: "admin@polymathcommunity.org",
    registrationOpen: true,
    requireEmailVerification: true,
    allowUserUploads: true,
    maxUploadSizeMB: 10,
    enableAIFeatures: true,
    enableChatbot: true,
    enableForumFeatures: true,
    enableWikiFeatures: true,
    enableLibraryFeatures: true,
    enableGameification: true,
    enableRealTimeUpdates: true,
    maintenanceMode: false
  });
  
  const [contentSettings, setContentSettings] = useState({
    maxDiscussionTitleLength: 100,
    maxDiscussionContentLength: 10000,
    maxCommentsPerPage: 20,
    allowRichTextInComments: true,
    allowImagesInComments: true,
    allowLinks: true,
    requireApprovalForNewTopics: false,
    autoModerateContent: true,
    moderationSeverity: "medium",
    bannedWords: "spam, offensive, inappropriate"
  });
  
  const [analyticsSettings, setAnalyticsSettings] = useState({
    enableTracking: true,
    anonymizeIPs: true,
    trackUserSession: true,
    saveSearchQueries: true,
    retentionPeriodDays: 90,
    generateWeeklyReports: true,
    sendAnalyticsEmails: true,
    trackFeatureUsage: true
  });

  const handleSiteSettingChange = (key, value) => {
    setSiteSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleContentSettingChange = (key, value) => {
    setContentSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleAnalyticsSettingChange = (key, value) => {
    setAnalyticsSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSiteSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Site settings saved",
      description: "Your changes have been applied successfully."
    });
    setIsSaving(false);
  };
  
  const handleSaveContentSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Content settings saved",
      description: "Your changes have been applied successfully."
    });
    setIsSaving(false);
  };
  
  const handleSaveAnalyticsSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Analytics settings saved",
      description: "Your changes have been applied successfully."
    });
    setIsSaving(false);
  };
  
  const handleClearCache = () => {
    toast({
      title: "Cache cleared",
      description: "System cache has been successfully cleared."
    });
  };
  
  const handleRebuildIndices = () => {
    toast({
      title: "Rebuilding indices",
      description: "Search indices are being rebuilt. This may take a few minutes."
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>
      
      <Tabs defaultValue="site" className="space-y-6">
        <TabsList>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="content">Content & Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        {/* Site Settings */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>General Site Settings</CardTitle>
              <CardDescription>Configure core platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => handleSiteSettingChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => handleSiteSettingChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteSettings.siteDescription}
                  onChange={(e) => handleSiteSettingChange("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteLogo">Logo URL</Label>
                <Input
                  id="siteLogo"
                  value={siteSettings.siteLogo}
                  onChange={(e) => handleSiteSettingChange("siteLogo", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Current logo: <img src={siteSettings.siteLogo} alt="Site Logo" className="inline-block h-5 align-middle ml-2" /></p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Feature Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="registrationOpen"
                      checked={siteSettings.registrationOpen}
                      onCheckedChange={(checked) => handleSiteSettingChange("registrationOpen", checked)}
                    />
                    <Label htmlFor="registrationOpen">Allow New Registrations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireEmailVerification"
                      checked={siteSettings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSiteSettingChange("requireEmailVerification", checked)}
                    />
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowUserUploads"
                      checked={siteSettings.allowUserUploads}
                      onCheckedChange={(checked) => handleSiteSettingChange("allowUserUploads", checked)}
                    />
                    <Label htmlFor="allowUserUploads">Allow User Uploads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableAIFeatures"
                      checked={siteSettings.enableAIFeatures}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableAIFeatures", checked)}
                    />
                    <Label htmlFor="enableAIFeatures">Enable AI Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableChatbot"
                      checked={siteSettings.enableChatbot}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableChatbot", checked)}
                    />
                    <Label htmlFor="enableChatbot">Enable Chatbot</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableForumFeatures"
                      checked={siteSettings.enableForumFeatures}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableForumFeatures", checked)}
                    />
                    <Label htmlFor="enableForumFeatures">Enable Forum</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableWikiFeatures"
                      checked={siteSettings.enableWikiFeatures}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableWikiFeatures", checked)}
                    />
                    <Label htmlFor="enableWikiFeatures">Enable Wiki</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableLibraryFeatures"
                      checked={siteSettings.enableLibraryFeatures}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableLibraryFeatures", checked)}
                    />
                    <Label htmlFor="enableLibraryFeatures">Enable Knowledge Library</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableGameification"
                      checked={siteSettings.enableGameification}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableGameification", checked)}
                    />
                    <Label htmlFor="enableGameification">Enable Gamification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableRealTimeUpdates"
                      checked={siteSettings.enableRealTimeUpdates}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableRealTimeUpdates", checked)}
                    />
                    <Label htmlFor="enableRealTimeUpdates">Enable Realtime Updates</Label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      value={siteSettings.maxUploadSizeMB}
                      onChange={(e) => handleSiteSettingChange("maxUploadSizeMB", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Maintenance Mode</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500 mb-2">
                      When enabled, only administrators can access the site.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="maintenanceMode"
                        checked={siteSettings.maintenanceMode}
                        onCheckedChange={(checked) => handleSiteSettingChange("maintenanceMode", checked)}
                      />
                      <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
                      {siteSettings.maintenanceMode && (
                        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSiteSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Site Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Content Settings */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content & Moderation Settings</CardTitle>
              <CardDescription>Configure content rules and moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxDiscussionTitleLength">Max Discussion Title Length</Label>
                  <Input
                    id="maxDiscussionTitleLength"
                    type="number"
                    value={contentSettings.maxDiscussionTitleLength}
                    onChange={(e) => handleContentSettingChange("maxDiscussionTitleLength", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscussionContentLength">Max Discussion Content Length</Label>
                  <Input
                    id="maxDiscussionContentLength"
                    type="number"
                    value={contentSettings.maxDiscussionContentLength}
                    onChange={(e) => handleContentSettingChange("maxDiscussionContentLength", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCommentsPerPage">Max Comments Per Page</Label>
                  <Input
                    id="maxCommentsPerPage"
                    type="number"
                    value={contentSettings.maxCommentsPerPage}
                    onChange={(e) => handleContentSettingChange("maxCommentsPerPage", parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Content Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowRichTextInComments"
                      checked={contentSettings.allowRichTextInComments}
                      onCheckedChange={(checked) => handleContentSettingChange("allowRichTextInComments", checked)}
                    />
                    <Label htmlFor="allowRichTextInComments">Allow Rich Text in Comments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowImagesInComments"
                      checked={contentSettings.allowImagesInComments}
                      onCheckedChange={(checked) => handleContentSettingChange("allowImagesInComments", checked)}
                    />
                    <Label htmlFor="allowImagesInComments">Allow Images in Comments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowLinks"
                      checked={contentSettings.allowLinks}
                      onCheckedChange={(checked) => handleContentSettingChange("allowLinks", checked)}
                    />
                    <Label htmlFor="allowLinks">Allow External Links</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireApprovalForNewTopics"
                      checked={contentSettings.requireApprovalForNewTopics}
                      onCheckedChange={(checked) => handleContentSettingChange("requireApprovalForNewTopics", checked)}
                    />
                    <Label htmlFor="requireApprovalForNewTopics">Require Approval for New Topics</Label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Moderation Settings</h3>
                <div className="grid gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoModerateContent"
                      checked={contentSettings.autoModerateContent}
                      onCheckedChange={(checked) => handleContentSettingChange("autoModerateContent", checked)}
                    />
                    <Label htmlFor="autoModerateContent">Auto-Moderate Content</Label>
                  </div>
                  
                  {contentSettings.autoModerateContent && (
                    <div className="space-y-2">
                      <Label htmlFor="moderationSeverity">Moderation Severity</Label>
                      <Select
                        value={contentSettings.moderationSeverity}
                        onValueChange={(value) => handleContentSettingChange("moderationSeverity", value)}
                      >
                        <SelectTrigger id="moderationSeverity">
                          <SelectValue placeholder="Select moderation severity" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border">
                          <SelectItem value="low">Low - Flag only extreme content</SelectItem>
                          <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                          <SelectItem value="high">High - Strict moderation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="bannedWords">Banned Words/Phrases</Label>
                    <Textarea
                      id="bannedWords"
                      value={contentSettings.bannedWords}
                      onChange={(e) => handleContentSettingChange("bannedWords", e.target.value)}
                      rows={3}
                      placeholder="Enter comma-separated list of banned words"
                    />
                    <p className="text-sm text-muted-foreground">Separate words or phrases with commas</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveContentSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Content Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Analytics Settings */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
              <CardDescription>Configure how user data is tracked and analyzed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableTracking"
                    checked={analyticsSettings.enableTracking}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("enableTracking", checked)}
                  />
                  <Label htmlFor="enableTracking">Enable Analytics Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymizeIPs"
                    checked={analyticsSettings.anonymizeIPs}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("anonymizeIPs", checked)}
                  />
                  <Label htmlFor="anonymizeIPs">Anonymize IP Addresses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trackUserSession"
                    checked={analyticsSettings.trackUserSession}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("trackUserSession", checked)}
                  />
                  <Label htmlFor="trackUserSession">Track User Sessions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="saveSearchQueries"
                    checked={analyticsSettings.saveSearchQueries}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("saveSearchQueries", checked)}
                  />
                  <Label htmlFor="saveSearchQueries">Save User Search Queries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="generateWeeklyReports"
                    checked={analyticsSettings.generateWeeklyReports}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("generateWeeklyReports", checked)}
                  />
                  <Label htmlFor="generateWeeklyReports">Generate Weekly Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendAnalyticsEmails"
                    checked={analyticsSettings.sendAnalyticsEmails}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("sendAnalyticsEmails", checked)}
                  />
                  <Label htmlFor="sendAnalyticsEmails">Send Analytics Emails</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trackFeatureUsage"
                    checked={analyticsSettings.trackFeatureUsage}
                    onCheckedChange={(checked) => handleAnalyticsSettingChange("trackFeatureUsage", checked)}
                  />
                  <Label htmlFor="trackFeatureUsage">Track Feature Usage</Label>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="retentionPeriodDays">Data Retention Period (Days)</Label>
                  <Input
                    id="retentionPeriodDays"
                    type="number"
                    value={analyticsSettings.retentionPeriodDays}
                    onChange={(e) => handleAnalyticsSettingChange("retentionPeriodDays", parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6 flex items-start gap-2">
                <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Analytics data helps improve the platform experience but must comply with privacy regulations.</p>
                  <p>Ensure your analytics settings comply with applicable laws like GDPR and CCPA.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveAnalyticsSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : "Save Analytics Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Perform system maintenance operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">Cache Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clear system cache to resolve performance issues or update stale content.
                  </p>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleClearCache}
                  >
                    <RefreshCcw size={16} />
                    <span>Clear System Cache</span>
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">Search Index Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rebuild search indices to ensure all content is properly searchable.
                  </p>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleRebuildIndices}
                  >
                    <RefreshCcw size={16} />
                    <span>Rebuild Search Indices</span>
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">Database Operations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perform database optimization operations.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline">Optimize Database</Button>
                    <Button variant="outline">Rebuild Database Views</Button>
                  </div>
                </div>
                
                <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    These actions can potentially cause data loss or service disruption.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="destructive">Reset All Settings</Button>
                    <Button variant="destructive">Clear All Analytics Data</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
