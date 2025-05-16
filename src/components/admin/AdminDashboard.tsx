
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Users, FileText, Settings, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AdminDashboardProps {
  isAdmin?: boolean;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AdminDashboard = ({ isAdmin = false }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    contentItems: 0,
    systemAlerts: 0
  });
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [contentTypeData, setContentTypeData] = useState<any[]>([]);
  const [userStatusData, setUserStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real stats from Supabase
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, status, created_at');
        
        if (usersError) throw usersError;
        
        const { data: content, error: contentError } = await supabase
          .from('media_posts')
          .select('id, type');
          
        if (contentError) throw contentError;
        
        // Calculate stats
        const totalUsers = users?.length || 0;
        const activeUsers = users?.filter(u => u.status === 'online').length || 0;
        const contentItems = content?.length || 0;
        
        setStats({
          totalUsers,
          activeUsers,
          contentItems,
          systemAlerts: 2 // Mock data for alerts as it's not in database yet
        });
        
        // Generate user growth data (mock)
        const lastWeek = [...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          
          // Count users created on this day
          const usersOnDay = users?.filter(user => {
            const createdDate = new Date(user.created_at);
            return createdDate.toDateString() === date.toDateString();
          }).length || 0;
          
          return {
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            users: usersOnDay + Math.floor(Math.random() * 5), // Add some randomness for mock data
            active: Math.floor(Math.random() * usersOnDay) + 1,
          };
        });
        
        setUserGrowthData(lastWeek);
        
        // Generate content type data
        const contentTypes = content?.reduce((acc: Record<string, number>, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {}) || {};
        
        const contentTypeArray = Object.entries(contentTypes).map(([name, value]) => ({
          name,
          value
        }));
        
        // Add some mock data if there are no content types
        if (contentTypeArray.length === 0) {
          setContentTypeData([
            { name: 'image', value: 5 },
            { name: 'video', value: 2 },
            { name: 'document', value: 3 },
            { name: 'youtube', value: 4 },
            { name: 'text', value: 8 }
          ]);
        } else {
          setContentTypeData(contentTypeArray);
        }
        
        // Generate user status data
        const statusCounts: Record<string, number> = {
          online: 0,
          away: 0,
          'do-not-disturb': 0,
          offline: 0,
          invisible: 0
        };
        
        users?.forEach(user => {
          const status = user.status || 'offline';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        const userStatusArray = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        setUserStatusData(userStatusArray);
      } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        toast({
          title: "Error loading dashboard data",
          description: error.message,
          variant: "destructive"
        });
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
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
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <ArrowUp size={12} />
                <span>12% from last month</span>
              </div>
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
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <ArrowUp size={12} />
                <span>8% from yesterday</span>
              </div>
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
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <ArrowUp size={12} />
                <span>24% from last month</span>
              </div>
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
              <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <ArrowDown size={12} />
                <span>3 resolved this week</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Settings size={20} className="text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userGrowthData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="active" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contentTypeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Maximum Upload Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">10 MB</p>
                <p className="text-xs text-muted-foreground mt-1">For all media types</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Max Post Title Length</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">100</p>
                <p className="text-xs text-muted-foreground mt-1">Characters</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Max Post Content Length</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">5000</p>
                <p className="text-xs text-muted-foreground mt-1">Characters</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Allowed Media Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Image, Video, Document</p>
                <p className="text-xs text-muted-foreground mt-1">+ YouTube links</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
