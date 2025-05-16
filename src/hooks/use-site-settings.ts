
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { set, get } from 'lodash';
import { Json } from '@/integrations/supabase/types';

// Export the SiteSettings interface so it can be imported by other files
export interface SiteSettings {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
    favicon: string;
    language: string;
  };
  users: {
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    allowSocialLogin: boolean;
    autoApproveUsers: boolean;
    defaultUserRole: string;
    allowAvatars: boolean;
    allowBios: boolean;
    allowWebsites: boolean;
    allowStatusChanges: boolean;
    maxBioLength: number;
    trackUserActivity: boolean;
    allowGhostMode: boolean;
    inactiveUserDays: number;
    accountDeletionPolicy: string;
  };
  forum: {
    allowGuestViewing: boolean;
    requireApproval: boolean;
    allowImages: boolean;
    allowFormatting: boolean;
    maxPostLength: number;
    minPostLength: number;
    postsPerPage: number;
    allowComments: boolean;
    nestedComments: boolean;
    commentModeration: boolean;
    allowVoting: boolean;
    maxCommentLength: number;
    nestedCommentsLevel: number;
  };
  wiki: {
    allowGuestViewing: boolean;
    allowAllUsersToEdit: boolean;
    requireApproval: boolean;
    showEditHistory: boolean;
    defaultArticleStatus: string;
    editRoles: string;
    enableMarkdown: boolean;
    enableWikiLinks: boolean;
    allowImages: boolean;
    enableTableOfContents: boolean;
    maxArticleLength: number;
    allowedCategories: string[];
    articlesPerPage: number;
  };
  chat: {
    enabled: boolean;
    allowDirectMessages: boolean;
    allowGroupChats: boolean;
    maxMessageLength: number;
    enableMentions: boolean;
    enableEmojis: boolean;
    enableFileSharing: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  content: {
    moderationEnabled: boolean;
    allowedMediaTypes: string[];
    maxUploadSize: number;
    maxTitleLength: number;
    enableTags: boolean;
    maxTagsPerItem: number;
    defaultSorting: string;
  };
  appearance: {
    defaultTheme: string;
    allowUserThemes: boolean;
    accentColor: string;
    buttonStyle: string;
    fontFamily: string;
    enableAnimations: boolean;
  };
  advanced: {
    cacheTime: number;
    debug: boolean;
    analyticsEnabled: boolean;
    enableApiAccess: boolean;
    maintenanceMode: boolean;
  };
  
  // Add these as top-level properties for backward compatibility
  siteName: string;
  siteDescription: string;
  contentModeration: boolean;
  maintenanceMode: boolean;
  maxFileSize: number;
  maxTitleLength: number;
  maxContentLength: number;
  allowedMediaTypes: string[];
  enableWikiCreation: boolean;
  enableMediaUploads: boolean;
  enableComments: boolean;
  autoApproveContent: boolean;
  
  // Add chatSettings as a property
  chatSettings: {
    enableGlobalChat: boolean;
    enablePrivateMessages: boolean;
    messageRetentionDays: number;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  site: {
    name: 'Polymath',
    tagline: 'Knowledge Community Platform',
    description: 'A platform for sharing and discussing knowledge',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    language: 'en',
  },
  users: {
    allowRegistration: true,
    requireEmailVerification: false,
    allowSocialLogin: true,
    autoApproveUsers: true,
    defaultUserRole: 'user',
    allowAvatars: true,
    allowBios: true,
    allowWebsites: true,
    allowStatusChanges: true,
    maxBioLength: 500,
    trackUserActivity: true,
    allowGhostMode: true,
    inactiveUserDays: 90,
    accountDeletionPolicy: 'manual',
  },
  forum: {
    allowGuestViewing: true,
    requireApproval: false,
    allowImages: true,
    allowFormatting: true,
    maxPostLength: 5000,
    minPostLength: 10,
    postsPerPage: 20,
    allowComments: true,
    nestedComments: true,
    commentModeration: false,
    allowVoting: true,
    maxCommentLength: 1000,
    nestedCommentsLevel: 3,
  },
  wiki: {
    allowGuestViewing: true,
    allowAllUsersToEdit: false,
    requireApproval: true,
    showEditHistory: true,
    defaultArticleStatus: 'draft',
    editRoles: 'contributors',
    enableMarkdown: true,
    enableWikiLinks: true,
    allowImages: true,
    enableTableOfContents: true,
    maxArticleLength: 50000,
    allowedCategories: ['Philosophy', 'Science', 'History', 'Art', 'Literature', 'Technology'],
    articlesPerPage: 12,
  },
  chat: {
    enabled: true,
    allowDirectMessages: true,
    allowGroupChats: true,
    maxMessageLength: 1000,
    enableMentions: true,
    enableEmojis: true,
    enableFileSharing: true,
    maxFileSize: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
  content: {
    moderationEnabled: true,
    allowedMediaTypes: ['image', 'video', 'audio', 'document'],
    maxUploadSize: 10,
    maxTitleLength: 100,
    enableTags: true,
    maxTagsPerItem: 10,
    defaultSorting: 'newest',
  },
  appearance: {
    defaultTheme: 'dark',
    allowUserThemes: true,
    accentColor: '#9b87f5',
    buttonStyle: 'rounded',
    fontFamily: 'Inter, system-ui, sans-serif',
    enableAnimations: true,
  },
  advanced: {
    cacheTime: 3600,
    debug: false,
    analyticsEnabled: true,
    enableApiAccess: false,
    maintenanceMode: false,
  },
  
  // Add top-level properties with default values
  siteName: 'Polymath',
  siteDescription: 'A platform for sharing and discussing knowledge',
  contentModeration: true,
  maintenanceMode: false,
  maxFileSize: 10,
  maxTitleLength: 100,
  maxContentLength: 10000,
  allowedMediaTypes: ['image', 'video', 'audio', 'document'],
  enableWikiCreation: true,
  enableMediaUploads: true,
  enableComments: true,
  autoApproveContent: false,
  
  // Add chatSettings
  chatSettings: {
    enableGlobalChat: true,
    enablePrivateMessages: true,
    messageRetentionDays: 30,
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('settings')
        .eq('id', 'global')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, create it with default settings
          const { error: insertError } = await supabase
            .from('site_settings')
            .insert([
              {
                id: 'global',
                settings: DEFAULT_SETTINGS as unknown as Json
              }
            ]);

          if (insertError) throw insertError;
          
          setSettings(DEFAULT_SETTINGS);
          setOriginalSettings(DEFAULT_SETTINGS);
        } else {
          throw error;
        }
      } else if (data?.settings) {
        // Merge the loaded settings with defaults to ensure all properties exist
        const loadedSettings = {
          ...DEFAULT_SETTINGS,
          ...(data.settings as unknown as SiteSettings)
        };
        
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      }
    } catch (err: any) {
      console.error('Error fetching site settings:', err);
      setError(`Failed to load settings: ${err.message}`);
      toast({
        title: "Error loading settings",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const { error } = await supabase
        .from('site_settings')
        .update({
          settings: settings as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'global');

      if (error) throw error;

      setOriginalSettings(settings);
      
      toast({
        title: "Settings saved",
        description: "Your changes have been applied successfully",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error saving site settings:', err);
      setError(`Failed to save settings: ${err.message}`);
      toast({
        title: "Error saving settings",
        description: err.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      toast({
        description: "Settings reset to last saved state",
      });
    } else {
      setSettings(DEFAULT_SETTINGS);
      toast({
        description: "Settings reset to defaults",
      });
    }
  };

  const updateSetting = (path: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [path]: value
    }));
  };

  const updateNestedSetting = (parentPath: string, key: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const path = parentPath ? `${parentPath}.${key}` : key;
      set(newSettings, path, value);
      return newSettings;
    });
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    saveSettings,
    resetSettings,
    updateSetting,
    updateNestedSetting
  };
};
