
import React, { useEffect, useState } from "react";
import { PageLayout } from "../../components/layouts/PageLayout";
import { TabNav } from "../../components/TabNav";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminContentManagement } from "@/components/admin/AdminContentManagement";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSettings } from "@/components/admin/AdminSettings"; 
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(true);

  // Check if current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setIsAdmin(data?.role === 'admin');
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Make the user an admin if they have the ID dc7bedf3-14c3-4376-adfb-de5ac8207adc
  useEffect(() => {
    const makeUserAdmin = async () => {
      if (!user || user.id !== 'dc7bedf3-14c3-4376-adfb-de5ac8207adc') {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id)
          .select();

        if (error) throw error;

        setIsAdmin(true);
        toast({
          title: "Admin Status Granted",
          description: "You now have administrator privileges",
        });
      } catch (err) {
        console.error('Error making user admin:', err);
      }
    };

    makeUserAdmin();
  }, [user, toast]);

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

  if (isCheckingAdmin) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
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

  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
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
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        
        <TabNav tabs={adminTabs} defaultTab="dashboard" />
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
