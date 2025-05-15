
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
  
  // Get progress data from localStorage for non-authenticated users
  // or from Supabase for authenticated users
  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      
      if (userId) {
        try {
          // Fetch from Supabase if we have a user ID
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId);
            
          if (error) {
            console.error('Error fetching progress:', error);
            // Fallback to local storage
            loadFromLocalStorage();
          } else if (data) {
            setProgressData(data.map(item => ({
              topicId: item.topic_id,
              progress: item.progress,
              lastViewed: new Date(item.last_viewed),
              completed: item.completed
            })));
          }
        } catch (error) {
          console.error('Error in progress tracking:', error);
          loadFromLocalStorage();
        }
      } else {
        // Not authenticated, use localStorage
        loadFromLocalStorage();
      }
      
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
    
    // Then persist to storage
    if (userId) {
      try {
        // Store in Supabase if authenticated
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            topic_id: topicId,
            progress,
            last_viewed: now.toISOString(),
            completed
          });
          
        if (error) {
          console.error('Error updating progress in database:', error);
          // Fallback to local storage
          saveToLocalStorage([...progressData, updatedItem]);
        }
      } catch (error) {
        console.error('Error in progress update:', error);
        saveToLocalStorage([...progressData, updatedItem]);
      }
    } else {
      // Save to localStorage if not authenticated
      saveToLocalStorage([...progressData, updatedItem]);
    }
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
