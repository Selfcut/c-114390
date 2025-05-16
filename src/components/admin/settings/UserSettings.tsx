
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SiteSettings } from '@/hooks/use-site-settings';

interface UserSettingsProps {
  settings: SiteSettings;
  updateSetting: (key: keyof SiteSettings, value: any) => void;
  updateNestedSetting: (category: keyof SiteSettings, key: string, value: any) => void;
}

export function UserSettings({ settings, updateSetting, updateNestedSetting }: UserSettingsProps) {
  return (
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
            onCheckedChange={(checked) => updateSetting('enableUserRegistration', checked)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultUserRole">Default User Role</Label>
          <Select 
            value={settings.defaultUserRole} 
            onValueChange={(value) => updateSetting('defaultUserRole', value)}
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
  );
}
