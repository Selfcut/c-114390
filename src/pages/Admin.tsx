
import React, { useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { TabNav } from "../components/TabNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Settings, Shield, Database, FileText, Bell } from "lucide-react";

const Admin = () => {
  // Tabs for admin dashboard
  const adminTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage your application settings and view analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Welcome to the admin dashboard. This is a work in progress.</p>
              <p className="text-muted-foreground mt-2">More functionality coming soon.</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "users",
      label: "Users",
      icon: <Users size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management interface will appear here.</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "content",
      label: "Content",
      icon: <FileText size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage content across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content management interface will appear here.</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings interface will appear here.</p>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        <div className="flex items-center gap-2 mb-8">
          <Shield size={24} className="text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users size={20} className="text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">364</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Users size={20} className="text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Items</p>
                <p className="text-2xl font-bold">842</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileText size={20} className="text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Alerts</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Bell size={20} className="text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <TabNav tabs={adminTabs} defaultTab="overview" />
      </main>
    </PageLayout>
  );
};

export default Admin;
