
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  BookOpen,
  TrendingUp,
  UserPlus,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const AdminDashboard = () => {
  // Simulated analytics data
  const userStats = {
    total: 2543,
    newToday: 42,
    activeToday: 876,
    premiumUsers: 187,
  };

  const contentStats = {
    totalPosts: 8721,
    totalComments: 24632,
    totalLibraryEntries: 1245,
    flaggedContent: 32,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview and analytics of the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: Just now
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats.newToday} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.activeToday}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((userStats.activeToday / userStats.total) * 100)}% of
              total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contentStats.totalPosts + contentStats.totalLibraryEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              In forums and library
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.flaggedContent}</div>
            <p className="text-xs text-muted-foreground">
              Flagged content requiring review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Chart placeholder (User Growth)
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Content Activity</CardTitle>
            <CardDescription>Posts, comments, and engagement</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Chart placeholder (Content Activity)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left font-medium text-muted-foreground p-2">Event</th>
                <th className="text-left font-medium text-muted-foreground p-2">User</th>
                <th className="text-left font-medium text-muted-foreground p-2">Time</th>
                <th className="text-left font-medium text-muted-foreground p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-2">New User Registration</td>
                <td className="p-2">alice_smith</td>
                <td className="p-2">5 minutes ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2">Content Flagged</td>
                <td className="p-2">john_doe</td>
                <td className="p-2">12 minutes ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">Review</Button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2">Premium Subscription</td>
                <td className="p-2">robert_chen</td>
                <td className="p-2">38 minutes ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2">New Forum Topic</td>
                <td className="p-2">sara_johnson</td>
                <td className="p-2">1 hour ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
              <tr>
                <td className="p-2">Library Entry Added</td>
                <td className="p-2">michael_brown</td>
                <td className="p-2">2 hours ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
