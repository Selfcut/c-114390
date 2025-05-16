
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Define default site settings
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  contentModeration: boolean;
  allowedMediaTypes: string[];
  enableUserRegistration: boolean;
  enableWikiCreation: boolean;
  enableMediaUploads: boolean;
  enableComments: boolean;
  enableLikes: boolean;
  maxUsernameLength: number;
  requireEmailVerification: boolean;
  maxUploadSizeMB: number;
  maxTitleLength: number;
  maxContentLength: number;
  maxFileSize: number;
  defaultUserRole: string;
  autoApproveContent: boolean;
  wikiEditorOptions: {
    enablePublicEditing: boolean;
    requireApproval: boolean;
    maxArticleLength: number;
    allowImages: boolean;
    allowVideos: boolean;
    allowLinks: boolean;
    maxImageSize: number;
  };
  userLimitations: {
    maxPostsPerDay: number;
    maxUploadsPerDay: number;
    maxCommentsPerDay: number;
  };
  forumSettings: {
    enableThreads: boolean;
    allowAnonymousPosts: boolean;
    maxThreadLength: number;
  };
  chatSettings: {
    enableGlobalChat: boolean;
    enablePrivateMessages: boolean;
    messageRetentionDays: number;
  };
}

// Default settings used when initializing
const defaultSettings: SiteSettings = {
  siteName: 'Polymath',
  siteDescription: 'Intellectual Science Community',
  maintenanceMode: false,
  contentModeration: true,
  allowedMediaTypes: ['image/*', 'video/*', 'application/pdf'],
  enableUserRegistration: true,
  enableWikiCreation: true,
  enableMediaUploads: true,
  enableComments: true,
  enableLikes: true,
  maxUsernameLength: 20,
  requireEmailVerification: false,
  maxUploadSizeMB: 10,
  maxTitleLength: 100,
  maxContentLength: 10000,
  maxFileSize: 5,
  defaultUserRole: 'user',
  autoApproveContent: false,
  wikiEditorOptions: {
    enablePublicEditing: false,
    requireApproval: true,
    maxArticleLength: 20000,
    allowImages: true,
    allowVideos: true,
    allowLinks: true,
    maxImageSize: 5
  },
  userLimitations: {
    maxPostsPerDay: 10,
    maxUploadsPerDay: 20,
    maxCommentsPerDay: 50
  },
  forumSettings: {
    enableThreads: true,
    allowAnonymousPosts: false,
    maxThreadLength: 10000
  },
  chatSettings: {
    enableGlobalChat: true,
    enablePrivateMessages: true,
    messageRetentionDays: 30
  }
};

const SETTINGS_ID = 'global-settings';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to load settings from database
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('settings')
        .eq('id', SETTINGS_ID)
        .single();

      if (fetchError) {
        // If not found, create with default settings
        if (fetchError.code === 'PGRST116') {
          await saveSettings(defaultSettings, true);
          setSettings(defaultSettings);
        } else {
          console.error('Error fetching settings:', fetchError);
          setError(fetchError.message || 'Failed to load settings');
        }
      } else if (data) {
        // Handle the data as a JSON object and cast to SiteSettings
        const loadedSettings = data.settings as unknown as SiteSettings;
        
        // Ensure all fields exist by merging with defaults
        const mergedSettings = {
          ...defaultSettings,
          ...loadedSettings,
          wikiEditorOptions: {
            ...defaultSettings.wikiEditorOptions,
            ...(loadedSettings.wikiEditorOptions || {})
          },
          userLimitations: {
            ...defaultSettings.userLimitations,
            ...(loadedSettings.userLimitations || {})
          },
          forumSettings: {
            ...defaultSettings.forumSettings,
            ...(loadedSettings.forumSettings || {})
          },
          chatSettings: {
            ...defaultSettings.chatSettings,
            ...(loadedSettings.chatSettings || {})
          }
        };
        
        setSettings(mergedSettings);
      }
    } catch (err: any) {
      console.error('Unexpected error loading settings:', err);
      setError(err.message || 'Unexpected error loading settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to save settings to database
  const saveSettings = async (settingsToSave = settings, isInitial = false) => {
    if (isSaving) return;
    
    setIsSaving(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          id: SETTINGS_ID,
          settings: settingsToSave as any // Force type to match Supabase's JSON type
        });

      if (upsertError) {
        console.error('Error saving settings:', upsertError);
        setError(upsertError.message || 'Failed to save settings');
        return { success: false, error: upsertError };
      }
      
      setSettings(settingsToSave);
      
      if (!isInitial) {
        toast({
          title: "Settings Saved",
          description: "Your settings have been updated successfully.",
        });
      }
      
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Unexpected error saving settings:', err);
      setError(err.message || 'Unexpected error saving settings');
      return { success: false, error: err };
    } finally {
      setIsSaving(false);
    }
  };

  // Function to update a single setting
  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Function to update a nested setting
  const updateNestedSetting = (category: keyof SiteSettings, key: string, value: any) => {
    setSettings(prev => {
      if (typeof prev[category] === 'object' && prev[category] !== null) {
        return {
          ...prev,
          [category]: {
            ...prev[category] as object,
            [key]: value
          }
        };
      }
      return prev;
    });
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults. Save to apply changes.",
    });
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    saveSettings: () => saveSettings(),
    resetSettings,
    updateSetting,
    updateNestedSetting,
    loadSettings
  };
};
