
import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Settings, FileText, Shield, Database, BookOpen, Lock, AlertCircle } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard"; // Fixed import
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminContentManagement } from "@/components/admin/AdminContentManagement";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminSpecialEffects } from "@/components/admin/AdminSpecialEffects";
import { CreateAdminAccount } from "@/components/admin/CreateAdminAccount";
import { useAuth } from "@/lib/auth/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageLayout } from "@/components/layouts/PageLayout";

const AdminPanel = () => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const location = useLocation();
  const { user, isLoading } = useAuth();
  
  // Check if user has admin role
  const isAdmin = user?.role === "admin" || user?.isAdmin;
  
  // Redirect to home if not admin
  if (!isLoading && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Get the current route to determine which tab is active
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/users")) return "users";
    if (path.includes("/content")) return "content";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/special-effects")) return "special-effects";
    if (path.includes("/create-admin")) return "create-admin";
    return "dashboard";
  };
  
  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingUsers(false);
      setIsLoadingContent(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="text-primary" size={32} />
            Admin Panel
          </h1>
        </div>

        {!isAdmin && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin panel. Please contact an administrator.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={getActiveTab()} className="mb-8">
          <TabsList className="flex flex-wrap justify-start mb-6 border-b w-full bg-transparent p-0 h-auto">
            <Link to="/admin" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="dashboard" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "dashboard" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </TabsTrigger>
            </Link>
            <Link to="/admin/users" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="users" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "users" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <Users size={18} />
                <span>Users</span>
              </TabsTrigger>
            </Link>
            <Link to="/admin/content" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="content" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "content" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <BookOpen size={18} />
                <span>Content</span>
              </TabsTrigger>
            </Link>
            <Link to="/admin/reports" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="reports" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "reports" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <FileText size={18} />
                <span>Reports</span>
              </TabsTrigger>
            </Link>
            <Link to="/admin/settings" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="settings" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "settings" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </TabsTrigger>
            </Link>
            <Link to="/admin/special-effects" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="special-effects" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "special-effects" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <Database size={18} />
                <span>Special Effects</span>
              </TabsTrigger>
            </Link>
            <Link to="/admin/create-admin" className="flex-1 sm:flex-initial">
              <TabsTrigger 
                value="create-admin" 
                className={`flex items-center gap-2 px-4 py-2 border-b-2 ${getActiveTab() === "create-admin" ? "border-primary" : "border-transparent"} rounded-none data-[state=active]:bg-muted/50 transition-all duration-200`}
              >
                <Lock size={18} />
                <span>Create Admin</span>
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {/* Admin routes */}
        <Routes>
          <Route index element={<AdminDashboard isAdmin={isAdmin} />} />
          <Route path="users" element={
            isLoadingUsers ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                  <div className="space-y-6">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-9" />
                          <Skeleton className="h-9 w-9" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AdminUserManagement />
            )
          } />
          <Route path="content" element={
            isLoadingContent ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                  <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Array(3).fill(0).map((_, j) => (
                            <div key={j} className="border rounded-lg p-4">
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-full mb-1" />
                              <Skeleton className="h-4 w-2/3" />
                              <div className="flex gap-2 mt-4">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AdminContentManagement />
            )
          } />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="special-effects" element={<AdminSpecialEffects />} />
          <Route path="create-admin" element={<CreateAdminAccount />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
