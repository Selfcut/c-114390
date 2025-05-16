
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteSettings } from '@/hooks/use-site-settings';

interface ForumSettingsProps {
  settings: SiteSettings;
  updateNestedSetting: (category: keyof SiteSettings, key: string, value: any) => void;
}

export function ForumSettings({ settings, updateNestedSetting }: ForumSettingsProps) {
  return (
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
  );
}
