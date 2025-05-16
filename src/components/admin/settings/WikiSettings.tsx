
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface WikiSettingsProps {
  settings: any;
  updateNestedSetting: (parentPath: string, key: string, value: any) => void;
}

export const WikiSettings: React.FC<WikiSettingsProps> = ({ 
  settings, 
  updateNestedSetting 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wiki Article Settings</CardTitle>
          <CardDescription>
            Configure wiki article creation and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="allowGuestViewing"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Guest Viewing</FormLabel>
                    <FormDescription>
                      Non-logged in users can view wiki articles
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.allowGuestViewing}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'allowGuestViewing', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowAllUsersToEdit"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">All Users Can Edit</FormLabel>
                    <FormDescription>
                      Any authenticated user can edit wiki content
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.allowAllUsersToEdit}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'allowAllUsersToEdit', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="requireApproval"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Edit Approval</FormLabel>
                    <FormDescription>
                      Wiki edits need moderator approval
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.requireApproval}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'requireApproval', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="showEditHistory"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Edit History</FormLabel>
                    <FormDescription>
                      Display article revision history
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.showEditHistory}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'showEditHistory', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="defaultArticleStatus"
            render={() => (
              <FormItem>
                <FormLabel>Default Article Status</FormLabel>
                <FormControl>
                  <Select
                    value={settings?.wiki?.defaultArticleStatus || 'draft'}
                    onValueChange={(value) => updateNestedSetting('wiki', 'defaultArticleStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Default status for newly created articles
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            name="editRoles"
            render={() => (
              <FormItem>
                <FormLabel>Who Can Edit Articles</FormLabel>
                <FormControl>
                  <Select
                    value={settings?.wiki?.editRoles || 'contributors'}
                    onValueChange={(value) => updateNestedSetting('wiki', 'editRoles', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Authenticated Users</SelectItem>
                      <SelectItem value="contributors">Contributors & Above</SelectItem>
                      <SelectItem value="moderators">Moderators & Admins Only</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Which user roles are allowed to edit wiki articles
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Wiki Content Settings</CardTitle>
          <CardDescription>
            Configure wiki content format and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="enableMarkdown"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Markdown</FormLabel>
                    <FormDescription>
                      Allow markdown formatting in wiki articles
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.enableMarkdown}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'enableMarkdown', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="enableWikiLinks"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Wiki-style Links</FormLabel>
                    <FormDescription>
                      Support [[page-name]] style internal links
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.enableWikiLinks}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'enableWikiLinks', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowImages"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Images</FormLabel>
                    <FormDescription>
                      Enable image uploads in wiki articles
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.allowImages}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'allowImages', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="enableTableOfContents"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Table of Contents</FormLabel>
                    <FormDescription>
                      Automatically generate TOC from headings
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.wiki?.enableTableOfContents}
                      onCheckedChange={(value) => updateNestedSetting('wiki', 'enableTableOfContents', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="maxArticleLength"
            render={() => (
              <FormItem>
                <FormLabel>Maximum Article Length (characters)</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[settings?.wiki?.maxArticleLength || 50000]}
                      max={500000}
                      step={10000}
                      onValueChange={([value]) => updateNestedSetting('wiki', 'maxArticleLength', value)}
                    />
                  </FormControl>
                  <span className="w-20 text-center font-medium">
                    {settings?.wiki?.maxArticleLength || 50000}
                  </span>
                </div>
                <FormDescription>
                  Maximum character count for wiki articles
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            name="allowedCategories"
            render={() => (
              <FormItem>
                <FormLabel>Allowed Categories (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Philosophy, Science, History, Art, Literature, Technology"
                    value={settings?.wiki?.allowedCategories?.join(', ') || ''}
                    onChange={(e) => updateNestedSetting('wiki', 'allowedCategories', 
                      e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    )}
                  />
                </FormControl>
                <FormDescription>
                  Categories that can be assigned to wiki articles (leave empty to allow any)
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            name="articlesPerPage"
            render={() => (
              <FormItem>
                <FormLabel>Articles Per Page</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={settings?.wiki?.articlesPerPage || 12}
                    onChange={(e) => updateNestedSetting('wiki', 'articlesPerPage', parseInt(e.target.value) || 12)}
                  />
                </FormControl>
                <FormDescription>
                  Number of articles to display per page in listings
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WikiSettings;
