import React from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  Bell, 
  FileText,
  ArrowRight,
  BookMarked,
  Users,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    stats, 
    activities, 
    notifications, 
    recommendations 
  } = useDashboardStats();

  // Example of how to render user avatar correctly
  const renderUserAvatar = () => {
    if (!user) return null;
    
    return (
      <Avatar>
        <AvatarImage src={user.avatar_url || user.avatar_url} />
        <AvatarFallback>
          {user?.name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
    );
  };

  const renderWelcomeCard = () => (
    <Card className="col-span-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {renderUserAvatar()}
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user?.name || 'Scholar'}</h2>
              <p className="text-muted-foreground">Here's what's happening in your intellectual journey today</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/profile">My Profile</Link>
            </Button>
            <Button asChild>
              <Link to="/forum">Join Discussions</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsCards = () => (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.discussions_count}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <MessageSquare className="inline h-3 w-3 mr-1" />
            Forum contributions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.contributions_count}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <FileText className="inline h-3 w-3 mr-1" />
            Wiki edits & notes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Reading List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.reading_list_count}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <BookOpen className="inline h-3 w-3 mr-1" />
            Books & articles
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.events_count}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <Calendar className="inline h-3 w-3 mr-1" />
            In the next 30 days
          </p>
        </CardContent>
      </Card>
    </>
  );

  const renderProgressCard = () => (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your intellectual journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Daily Streak</span>
              <span className="text-sm text-muted-foreground">{stats.streak} days</span>
            </div>
            <Progress value={Math.min(stats.streak * 10, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Keep learning daily to increase your streak
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Knowledge Karma</span>
              <span className="text-sm text-muted-foreground">{stats.karma} points</span>
            </div>
            <Progress value={Math.min(stats.karma / 10, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Earn karma by helping others learn
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Challenges</span>
              <span className="text-sm text-muted-foreground">{stats.completed_challenges}/10 completed</span>
            </div>
            <Progress value={(stats.completed_challenges / 10) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              <Award className="inline h-3 w-3 mr-1" />
              Complete intellectual challenges to earn badges
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderActivityAndNotifications = () => (
    <Tabs defaultValue="activity" className="col-span-full md:col-span-2">
      <TabsList>
        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        <TabsTrigger value="notifications">
          Notifications
          {notifications.length > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
              {notifications.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="activity" className="space-y-4 mt-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity, i) => (
            <div key={i} className="flex gap-3 items-start border-b pb-3 last:border-0">
              <div className="bg-primary/10 p-2 rounded-full">
                {activity.type === 'comment' && <MessageSquare className="h-5 w-5 text-primary" />}
                {activity.type === 'read' && <BookOpen className="h-5 w-5 text-primary" />}
                {activity.type === 'contribution' && <FileText className="h-5 w-5 text-primary" />}
                {activity.type === 'event' && <Calendar className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent activity to show</p>
            <Button variant="link" asChild className="mt-2">
              <Link to="/forum">Start participating in discussions</Link>
            </Button>
          </div>
        )}
        
        {activities.length > 0 && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/profile">View All Activity</Link>
          </Button>
        )}
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4 mt-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notification, i) => (
            <div key={i} className="flex gap-3 items-start border-b pb-3 last:border-0">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <CheckCircle2 className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No new notifications</p>
          </div>
        )}
        
        {notifications.length > 0 && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/notifications">View All Notifications</Link>
          </Button>
        )}
      </TabsContent>
    </Tabs>
  );

  const renderRecommendations = () => (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Based on your interests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, i) => (
            <div key={i} className="border-b pb-3 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                {rec.type === 'book' && <BookMarked className="h-4 w-4 text-primary" />}
                {rec.type === 'discussion' && <MessageSquare className="h-4 w-4 text-primary" />}
                {rec.type === 'person' && <Users className="h-4 w-4 text-primary" />}
                {rec.type === 'idea' && <Lightbulb className="h-4 w-4 text-primary" />}
                <span className="text-sm font-medium">{rec.title}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <Link to={rec.link}>
                  Explore <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recommendations yet</p>
            <p className="text-xs mt-1">Complete your profile to get personalized recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {renderWelcomeCard()}
          {renderStatsCards()}
          {renderProgressCard()}
          {renderActivityAndNotifications()}
          {renderRecommendations()}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
