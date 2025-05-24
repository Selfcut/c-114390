
import React from 'react';
import { useAuth } from '@/lib/auth';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { CommunityActivity } from '@/components/dashboard/CommunityActivity';
import { LearningProgress } from '@/components/dashboard/LearningProgress';
import { UpcomingEventsCard } from '@/components/dashboard/UpcomingEventsCard';
import { QuickNotesCard } from '@/components/dashboard/QuickNotesCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgressTracking } from '@/hooks/use-progress-tracking';
import { fetchLearningProgress, extractTopicsFromActivities, createProgressDataFromTopics, addDefaultTopics } from '@/lib/utils/data-utils';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Load progress data
  useEffect(() => {
    const loadProgressData = async () => {
      if (!user?.id) {
        // Use default topics for non-authenticated users
        setProgressData(addDefaultTopics());
        setIsLoadingProgress(false);
        return;
      }

      try {
        setIsLoadingProgress(true);
        const activities = await fetchLearningProgress(user.id);
        
        if (activities.length > 0) {
          const topics = extractTopicsFromActivities(activities);
          const progress = createProgressDataFromTopics(topics);
          
          if (progress.length > 0) {
            setProgressData(progress);
          } else {
            setProgressData(addDefaultTopics());
          }
        } else {
          setProgressData(addDefaultTopics());
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
        setProgressData(addDefaultTopics());
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgressData();
  }, [user?.id]);

  const handleProgressCardClick = (item: any) => {
    // Navigate to relevant content based on the topic
    window.location.href = `/library?search=${encodeURIComponent(item.title)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your intellectual journey today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/forum">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forum Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">New discussions this week</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/library">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Library Content</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Articles & resources</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/events">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/forum">New Discussion</Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/quotes">Add Quote</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed />
          <CommunityActivity />
        </div>
        
        <div className="space-y-6">
          <LearningProgress 
            progressData={progressData}
            onCardClick={handleProgressCardClick}
          />
          <UpcomingEventsCard />
          <QuickNotesCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
