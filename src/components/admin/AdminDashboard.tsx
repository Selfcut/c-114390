
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Users, FileText, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminDashboardProps {
  isAdmin?: boolean;
}

export const AdminDashboard = ({ isAdmin = false }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    contentItems: 0,
    systemAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Fetch real stats from Supabase
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, status');
        
        if (usersError) throw usersError;
        
        const { data: content, error: contentError } = await supabase
          .from('quotes')
          .select('id');
          
        if (contentError) throw contentError;
        
        setStats({
          totalUsers: users?.length || 0,
          activeUsers: users?.filter(u => u.status === 'online').length || 0,
          contentItems: content?.length || 0,
          systemAlerts: 2 // Mock data for alerts as it's not in database yet
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">You do not have permission to view this dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="w-full">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card className="w-full">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users size={20} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{stats.activeUsers}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Users size={20} className="text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Content Items</p>
              <p className="text-2xl font-bold">{stats.contentItems}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <FileText size={20} className="text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Alerts</p>
              <p className="text-2xl font-bold">{stats.systemAlerts}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Settings size={20} className="text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <div className="h-64 flex items-center justify-center w-full">
            <BarChart3 size={100} className="text-muted-foreground/30" />
            <p className="ml-4 text-muted-foreground">Analytics charts will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
