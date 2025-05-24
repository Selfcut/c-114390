
import { useState, useCallback } from 'react';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export const useUploadProgress = () => {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
    error: null
  });

  const startUpload = useCallback(() => {
    setUploadState({
      progress: 0,
      isUploading: true,
      error: null
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setUploadState(prev => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100)
    }));
  }, []);

  const completeUpload = useCallback(() => {
    setUploadState({
      progress: 100,
      isUploading: false,
      error: null
    });
  }, []);

  const failUpload = useCallback((error: string) => {
    setUploadState({
      progress: 0,
      isUploading: false,
      error
    });
  }, []);

  const resetUpload = useCallback(() => {
    setUploadState({
      progress: 0,
      isUploading: false,
      error: null
    });
  }, []);

  return {
    ...uploadState,
    startUpload,
    updateProgress,
    completeUpload,
    failUpload,
    resetUpload
  };
};
