
import React from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/lib/auth';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickNotesCard } from '@/components/dashboard/QuickNotesCard';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Award,
  Book 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { isLoading, stats, activities, notifications, recommendations } = useDashboardStats();

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Welcome{user ? `, ${user.name || 'Scholar'}` : ''}</p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.discussions_count}</div>
              <p className="text-xs text-muted-foreground">
                Active conversations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Contributions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.contributions_count}</div>
              <p className="text-xs text-muted-foreground">
                Knowledge contributions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reading List</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.reading_list_count}</div>
              <p className="text-xs text-muted-foreground">
                Saved for later
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.events_count}</div>
              <p className="text-xs text-muted-foreground">
                Upcoming events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {activity.type === 'comment' ? (
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                        ) : activity.type === 'read' ? (
                          <BookOpen className="h-5 w-5 text-green-500" />
                        ) : (
                          <Book className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Notes */}
          <div className="md:col-span-1">
            <QuickNotesCard />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
