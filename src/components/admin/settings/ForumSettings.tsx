
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
import { Slider } from '@/components/ui/slider';

interface ForumSettingsProps {
  settings: any;
  updateNestedSetting: (parentPath: string, key: string, value: any) => void;
}

export const ForumSettings: React.FC<ForumSettingsProps> = ({ 
  settings, 
  updateNestedSetting 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forum Post Settings</CardTitle>
          <CardDescription>
            Configure forum post creation and display settings
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
                      Non-logged in users can view forum posts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.allowGuestViewing}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'allowGuestViewing', value)}
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
                    <FormLabel className="text-base">Require Post Approval</FormLabel>
                    <FormDescription>
                      New posts need moderator approval before being visible
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.requireApproval}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'requireApproval', value)}
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
                    <FormLabel className="text-base">Allow Images in Posts</FormLabel>
                    <FormDescription>
                      Users can embed images in their posts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.allowImages}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'allowImages', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowFormatting"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Rich Text Formatting</FormLabel>
                    <FormDescription>
                      Users can format their posts with markdown or rich text
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.allowFormatting}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'allowFormatting', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="maxPostLength"
            render={() => (
              <FormItem>
                <FormLabel>Maximum Post Length (characters)</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[settings?.forum?.maxPostLength || 5000]}
                      max={50000}
                      step={1000}
                      onValueChange={([value]) => updateNestedSetting('forum', 'maxPostLength', value)}
                    />
                  </FormControl>
                  <span className="w-16 text-center font-medium">
                    {settings?.forum?.maxPostLength || 5000}
                  </span>
                </div>
                <FormDescription>
                  Maximum number of characters allowed in forum posts
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            name="minPostLength"
            render={() => (
              <FormItem>
                <FormLabel>Minimum Post Length (characters)</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[settings?.forum?.minPostLength || 10]}
                      max={500}
                      step={10}
                      onValueChange={([value]) => updateNestedSetting('forum', 'minPostLength', value)}
                    />
                  </FormControl>
                  <span className="w-12 text-center font-medium">
                    {settings?.forum?.minPostLength || 10}
                  </span>
                </div>
                <FormDescription>
                  Minimum number of characters required for forum posts
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            name="postsPerPage"
            render={() => (
              <FormItem>
                <FormLabel>Posts Per Page</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={settings?.forum?.postsPerPage || 20}
                    onChange={(e) => updateNestedSetting('forum', 'postsPerPage', parseInt(e.target.value) || 20)}
                  />
                </FormControl>
                <FormDescription>
                  Number of posts to display per page
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Forum Comment Settings</CardTitle>
          <CardDescription>
            Configure forum comment permissions and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="allowComments"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Comments</FormLabel>
                    <FormDescription>
                      Users can comment on forum posts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.allowComments}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'allowComments', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="nestedComments"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Nested Comments</FormLabel>
                    <FormDescription>
                      Allow replies to comments
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.nestedComments}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'nestedComments', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="commentModeration"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Comment Moderation</FormLabel>
                    <FormDescription>
                      Comments require approval before being visible
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.commentModeration}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'commentModeration', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowVoting"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Voting on Posts/Comments</FormLabel>
                    <FormDescription>
                      Users can upvote or downvote content
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.forum?.allowVoting}
                      onCheckedChange={(value) => updateNestedSetting('forum', 'allowVoting', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="maxCommentLength"
            render={() => (
              <FormItem>
                <FormLabel>Maximum Comment Length (characters)</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[settings?.forum?.maxCommentLength || 1000]}
                      max={10000}
                      step={100}
                      onValueChange={([value]) => updateNestedSetting('forum', 'maxCommentLength', value)}
                    />
                  </FormControl>
                  <span className="w-16 text-center font-medium">
                    {settings?.forum?.maxCommentLength || 1000}
                  </span>
                </div>
                <FormDescription>
                  Maximum number of characters allowed in comments
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            name="nestedCommentsLevel"
            render={() => (
              <FormItem>
                <FormLabel>Maximum Nested Comments Level</FormLabel>
                <FormControl>
                  <Select
                    value={String(settings?.forum?.nestedCommentsLevel || 3)}
                    onValueChange={(value) => updateNestedSetting('forum', 'nestedCommentsLevel', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 level</SelectItem>
                      <SelectItem value="2">2 levels</SelectItem>
                      <SelectItem value="3">3 levels</SelectItem>
                      <SelectItem value="5">5 levels</SelectItem>
                      <SelectItem value="10">10 levels</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Maximum depth of nested comments
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumSettings;
