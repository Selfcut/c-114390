
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteSettings } from '@/hooks/use-site-settings';

interface GeneralSettingsProps {
  settings: SiteSettings;
  updateSetting: (key: keyof SiteSettings, value: any) => void;
}

export function GeneralSettings({ settings, updateSetting }: GeneralSettingsProps) {
  return (
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
            onChange={(e) => updateSetting('siteName', e.target.value)}
            placeholder="Enter site name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Input 
            id="siteDescription" 
            value={settings.siteDescription}
            onChange={(e) => updateSetting('siteDescription', e.target.value)}
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
            onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
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
            onCheckedChange={(checked) => updateSetting('contentModeration', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
