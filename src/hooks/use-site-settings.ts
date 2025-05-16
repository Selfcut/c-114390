
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { set, get } from 'lodash';

const DEFAULT_SETTINGS = {
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
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<any>(null);
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
                settings: DEFAULT_SETTINGS
              }
            ]);

          if (insertError) throw insertError;
          
          setSettings(DEFAULT_SETTINGS);
          setOriginalSettings(DEFAULT_SETTINGS);
        } else {
          throw error;
        }
      } else {
        const loadedSettings = {
          ...DEFAULT_SETTINGS,
          ...data.settings
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
          settings: settings,
          updated_at: new Date()
        })
        .eq('id', 'global');

      if (error) throw error;

      setOriginalSettings(settings);
      
      toast({
        title: "Settings saved",
        description: "Your changes have been applied successfully",
      });
    } catch (err: any) {
      console.error('Error saving site settings:', err);
      setError(`Failed to save settings: ${err.message}`);
      toast({
        title: "Error saving settings",
        description: err.message,
        variant: "destructive"
      });
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

  const updateSetting = (path: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [path]: value
    }));
  };

  const updateNestedSetting = (parentPath: string, key: string, value: any) => {
    setSettings((prev: any) => {
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
