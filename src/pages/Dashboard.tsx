
import React from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { QuickNotesCard } from "@/components/dashboard/QuickNotesCard";
import { 
  BookOpen, 
  MessageSquare, 
  Image, 
  Heart, 
  Bookmark, 
  TrendingUp,
  Calendar,
  Users,
  BookmarkIcon,
  CalendarDays
} from "lucide-react";

const Dashboard = () => {
  const { stats, activities, notifications, recommendations, isLoading, refreshStats } = useDashboardStats();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const statCards = [
    {
      title: "Discussions",
      value: stats.discussions_count,
      icon: MessageSquare,
      description: "Forum posts created"
    },
    {
      title: "Contributions", 
      value: stats.contributions_count,
      icon: TrendingUp,
      description: "Total content shared"
    },
    {
      title: "Reading List",
      value: stats.reading_list_count,
      icon: BookmarkIcon,
      description: "Bookmarked items"
    },
    {
      title: "Events",
      value: stats.events_count,
      icon: CalendarDays,
      description: "Upcoming events"
    }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={refreshStats} variant="outline">
            Refresh Stats
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Notes - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <QuickNotesCard />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p>{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="border-l-2 border-primary pl-3">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No notifications
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="space-y-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                      <span className="inline-block text-xs bg-secondary px-2 py-1 rounded">
                        {rec.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recommendations
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
