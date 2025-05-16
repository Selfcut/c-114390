
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteSettings } from '@/hooks/use-site-settings';

interface WikiSettingsProps {
  settings: SiteSettings;
  updateNestedSetting: (category: keyof SiteSettings, key: string, value: any) => void;
}

export function WikiSettings({ settings, updateNestedSetting }: WikiSettingsProps) {
  return (
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
  );
}
