
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { SiteSettings } from '@/hooks/use-site-settings';

interface AdvancedSettingsProps {
  settings: SiteSettings;
  updateSetting: (key: keyof SiteSettings, value: any) => void;
}

export function AdvancedSettings({ settings, updateSetting }: AdvancedSettingsProps) {
  return (
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
            onChange={(e) => updateSetting(
              'allowedMediaTypes', 
              e.target.value.split(',').map(type => type.trim())
            )}
            placeholder="image/*, video/*, etc."
          />
          <p className="text-xs text-muted-foreground">Comma-separated list of allowed MIME types</p>
        </div>
      </CardContent>
    </Card>
  );
}
