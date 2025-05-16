
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface SiteSettings {
  enableUserRegistration: boolean;
  enableWikiCreation: boolean;
  enableMediaUploads: boolean;
  enableComments: boolean;
  defaultUserRole: string;
  maxFileSize: number;
  maxTitleLength: number;
  maxContentLength: number;
  siteName: string;
  siteDescription: string;
  allowedMediaTypes: string[];
  maintenanceMode: boolean;
  contentModeration: boolean;
  autoApproveContent: boolean;
  wikiEditorOptions: {
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
    maxThreadLength: number;
    allowAnonymousPosts: boolean;
  };
  chatSettings: {
    enableGlobalChat: boolean;
    enablePrivateMessages: boolean;
    messageRetentionDays: number;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  enableUserRegistration: true,
  enableWikiCreation: true,
  enableMediaUploads: true,
  enableComments: true,
  defaultUserRole: 'user',
  maxFileSize: 10, // MB
  maxTitleLength: 100,
  maxContentLength: 10000,
  siteName: 'Polymath Platform',
  siteDescription: 'A platform for sharing knowledge and media',
  allowedMediaTypes: ['image/*', 'video/*', 'application/pdf', 'audio/*'],
  maintenanceMode: false,
  contentModeration: true,
  autoApproveContent: false,
  wikiEditorOptions: {
    allowImages: true,
    allowVideos: true,
    allowLinks: true,
    maxImageSize: 5, // MB
  },
  userLimitations: {
    maxPostsPerDay: 10,
    maxUploadsPerDay: 20,
    maxCommentsPerDay: 50,
  },
  forumSettings: {
    enableThreads: true,
    maxThreadLength: 500,
    allowAnonymousPosts: false,
  },
  chatSettings: {
    enableGlobalChat: true,
    enablePrivateMessages: true,
    messageRetentionDays: 30,
  }
};

export function useSiteSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from database or local storage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load from Supabase if available
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) {
        console.error('Error loading settings from database:', error);
        // Fall back to localStorage
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } else if (data && data.settings) {
        // Type assertion to safely convert Json to SiteSettings
        const loadedSettings = data.settings as Record<string, any>;
        
        // Create a new settings object with defaults + loaded values
        const mergedSettings: SiteSettings = {
          ...DEFAULT_SETTINGS,
          ...loadedSettings
        };
        
        setSettings(mergedSettings);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Try to save to Supabase
      try {
        // Convert the settings object to a JSON compatible object
        const settingsJson = JSON.parse(JSON.stringify(settings)) as Json;
        
        const { error } = await supabase
          .from('site_settings')
          .upsert({ 
            id: 'global', 
            settings: settingsJson,
            updated_at: new Date().toISOString() 
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error saving to database, using localStorage instead:', err);
        // Fall back to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(settings));
      }

      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      toast({
        title: "Error",
        description: "There was a problem saving your settings.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    });
  };

  const updateNestedSetting = (category: keyof SiteSettings, key: string, value: any) => {
    if (typeof settings[category] === 'object' && !Array.isArray(settings[category])) {
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value
        }
      });
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  return {
    settings,
    setSettings,
    isLoading,
    isSaving,
    error,
    saveSettings,
    resetSettings,
    updateNestedSetting,
    updateSetting,
    loadSettings
  };
}
