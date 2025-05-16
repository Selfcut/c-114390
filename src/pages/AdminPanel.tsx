import React, { useEffect, useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { TabNav } from "../components/TabNav";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminContentManagement } from "@/components/admin/AdminContentManagement";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSettings } from "@/components/admin/AdminSettings"; 
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Bell } from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(true);

  // Check if current user is an admin and make specified user an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsCheckingAdmin(false);
        return;
      }

      try {
        // Make specific user an admin (as requested)
        if (user.id === 'dc7bedf3-14c3-4376-adfb-de5ac8207adc') {
          // Update the role to admin
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating admin status:', updateError);
          } else {
            setIsAdmin(true);
            toast({
              title: "Admin Role Granted",
              description: "You now have administrator privileges",
            });
            setIsCheckingAdmin(false);
            return;
          }
        }

        // Check admin status for all users
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'admin');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  // Admin panel tabs
  const adminTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      content: <AdminDashboard isAdmin={isAdmin} />,
    },
    {
      id: "userManagement",
      label: "User Management",
      content: <AdminUserManagement />,
    },
    {
      id: "contentManagement",
      label: "Content Management",
      content: <AdminContentManagement />,
    },
    {
      id: "reports",
      label: "Reports",
      content: <AdminReports />,
    },
    {
      id: "settings",
      label: "Settings",
      content: <AdminSettings />,
    },
  ];

  // Admin panel loading state
  if (isCheckingAdmin) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Access denied state
  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Access Denied</h1>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500 font-medium text-lg mb-2">You do not have permission to access the admin panel.</p>
              <p className="text-muted-foreground">Please contact an administrator if you believe this is an error.</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom duration-300">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Bell size={20} className="text-blue-500" />
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
              <Bell size={20} className="text-green-500" />
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
              <Bell size={20} className="text-amber-500" />
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
      
      <TabNav tabs={adminTabs} defaultTab="dashboard" />
    </div>
  );
};

export default AdminPanel;
