
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface ProgressData {
  topicId: string;
  progress: number;
  lastViewed: Date;
  completed: boolean;
}

export function useProgressTracking(userId?: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  
  // Get progress data from localStorage
  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      
      // For now, always use localStorage since the Supabase tables don't exist yet
      loadFromLocalStorage();
      setIsLoading(false);
    };
    
    const loadFromLocalStorage = () => {
      try {
        const storedProgress = localStorage.getItem('user_progress');
        if (storedProgress) {
          const parsed = JSON.parse(storedProgress);
          setProgressData(parsed.map((item: any) => ({
            ...item,
            lastViewed: new Date(item.lastViewed)
          })));
        }
      } catch (error) {
        console.error('Error loading progress from localStorage:', error);
        setProgressData([]);
      }
    };
    
    fetchProgress();
  }, [userId]);
  
  // Update progress for a topic
  const updateProgress = async (topicId: string, progress: number, completed = false) => {
    const now = new Date();
    const updatedItem: ProgressData = {
      topicId,
      progress,
      lastViewed: now,
      completed
    };
    
    // Update local state first for responsive UI
    setProgressData(prev => {
      const existing = prev.find(item => item.topicId === topicId);
      if (existing) {
        return prev.map(item => 
          item.topicId === topicId ? updatedItem : item
        );
      } else {
        return [...prev, updatedItem];
      }
    });
    
    // Save to localStorage
    const updatedData = progressData.some(item => item.topicId === topicId)
      ? progressData.map(item => item.topicId === topicId ? updatedItem : item)
      : [...progressData, updatedItem];
    
    saveToLocalStorage(updatedData);
  };
  
  const saveToLocalStorage = (data: ProgressData[]) => {
    try {
      localStorage.setItem('user_progress', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  const getTopicProgress = (topicId: string) => {
    return progressData.find(item => item.topicId === topicId) || {
      topicId,
      progress: 0,
      lastViewed: new Date(),
      completed: false
    };
  };
  
  return {
    isLoading,
    progressData,
    updateProgress,
    getTopicProgress
  };
}
