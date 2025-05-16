
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

interface UserSettingsProps {
  settings: any;
  updateSetting: (path: string, value: any) => void;
  updateNestedSetting: (parentPath: string, key: string, value: any) => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ 
  settings, 
  updateSetting, 
  updateNestedSetting 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registration Settings</CardTitle>
          <CardDescription>
            Control how users can register and what information they need to provide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="allowRegistration"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Registration</FormLabel>
                    <FormDescription>
                      When disabled, only admins can create new accounts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowRegistration}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowRegistration', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="requireEmailVerification"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Email Verification</FormLabel>
                    <FormDescription>
                      Users must verify their email before they can use the platform
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.requireEmailVerification}
                      onCheckedChange={(value) => updateNestedSetting('users', 'requireEmailVerification', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowSocialLogin"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Social Login</FormLabel>
                    <FormDescription>
                      Enable sign-in with third party services
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowSocialLogin}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowSocialLogin', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="autoApproveUsers"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-approve New Users</FormLabel>
                    <FormDescription>
                      Automatically approve new user registrations
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.autoApproveUsers}
                      onCheckedChange={(value) => updateNestedSetting('users', 'autoApproveUsers', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="defaultUserRole"
            render={() => (
              <FormItem>
                <FormLabel>Default User Role</FormLabel>
                <FormControl>
                  <Select
                    value={settings?.users?.defaultUserRole || 'user'}
                    onValueChange={(value) => updateNestedSetting('users', 'defaultUserRole', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  The default role assigned to new users
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Profile Settings</CardTitle>
          <CardDescription>
            Configure what information users can add to their profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="allowAvatars"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Custom Avatars</FormLabel>
                    <FormDescription>
                      Users can upload their own profile pictures
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowAvatars}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowAvatars', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowBios"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow User Bios</FormLabel>
                    <FormDescription>
                      Users can add biographical information
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowBios}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowBios', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowWebsites"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Website Links</FormLabel>
                    <FormDescription>
                      Users can add personal website links
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowWebsites}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowWebsites', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowStatusChanges"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Status Changes</FormLabel>
                    <FormDescription>
                      Users can change their online status
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowStatusChanges}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowStatusChanges', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            name="maxBioLength"
            render={() => (
              <FormItem>
                <FormLabel>Maximum Bio Length (characters)</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[settings?.users?.maxBioLength || 500]}
                      max={2000}
                      step={10}
                      onValueChange={([value]) => updateNestedSetting('users', 'maxBioLength', value)}
                    />
                  </FormControl>
                  <span className="w-12 text-center font-medium">
                    {settings?.users?.maxBioLength || 500}
                  </span>
                </div>
                <FormDescription>
                  Maximum number of characters allowed in user biographies
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Activity Settings</CardTitle>
          <CardDescription>
            Control user activity tracking and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="trackUserActivity"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Track User Activity</FormLabel>
                    <FormDescription>
                      Record user logins and activity
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.trackUserActivity}
                      onCheckedChange={(value) => updateNestedSetting('users', 'trackUserActivity', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="allowGhostMode"
              render={() => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Ghost Mode</FormLabel>
                    <FormDescription>
                      Users can browse invisibly
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings?.users?.allowGhostMode}
                      onCheckedChange={(value) => updateNestedSetting('users', 'allowGhostMode', value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="inactiveUserDays"
              render={() => (
                <FormItem>
                  <FormLabel>Inactive User Threshold (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={settings?.users?.inactiveUserDays || 90}
                      onChange={(e) => updateNestedSetting('users', 'inactiveUserDays', parseInt(e.target.value) || 90)}
                    />
                  </FormControl>
                  <FormDescription>
                    Days after which a user is considered inactive
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              name="accountDeletionPolicy"
              render={() => (
                <FormItem>
                  <FormLabel>Account Deletion Policy</FormLabel>
                  <FormControl>
                    <Select
                      value={settings?.users?.accountDeletionPolicy || 'manual'}
                      onValueChange={(value) => updateNestedSetting('users', 'accountDeletionPolicy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Only</SelectItem>
                        <SelectItem value="userInitiated">User Initiated</SelectItem>
                        <SelectItem value="autoInactive">Auto-delete Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    How user accounts can be deleted from the system
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
