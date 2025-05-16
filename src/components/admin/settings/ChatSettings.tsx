
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteSettings } from '@/hooks/use-site-settings';

interface ChatSettingsProps {
  settings: SiteSettings;
  updateNestedSetting: (category: keyof SiteSettings, key: string, value: any) => void;
}

export function ChatSettings({ settings, updateNestedSetting }: ChatSettingsProps) {
  return (
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
  );
}
