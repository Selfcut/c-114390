
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SiteSettings } from '@/hooks/use-site-settings';

interface ContentSettingsProps {
  settings: SiteSettings;
  updateSetting: (key: keyof SiteSettings, value: any) => void;
}

export function ContentSettings({ settings, updateSetting }: ContentSettingsProps) {
  return (
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
              onChange={(e) => updateSetting('maxTitleLength', Number(e.target.value))}
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
              onChange={(e) => updateSetting('maxContentLength', Number(e.target.value))}
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
              onChange={(e) => updateSetting('maxFileSize', Number(e.target.value))}
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
            onCheckedChange={(checked) => updateSetting('autoApproveContent', checked)}
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
            onCheckedChange={(checked) => updateSetting('enableWikiCreation', checked)}
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
            onCheckedChange={(checked) => updateSetting('enableMediaUploads', checked)}
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
            onCheckedChange={(checked) => updateSetting('enableComments', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
