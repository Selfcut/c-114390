import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: "Failed to fetch users.",
            variant: "destructive",
          });
          return;
        }

        setUsers(data as UserProfile[]);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Data for user role distribution chart
  const roleData = users.reduce((acc: { name: string; value: number }[], user) => {
    const role = user.role || 'user';
    const existingRole = acc.find(item => item.name === role);
    if (existingRole) {
      existingRole.value += 1;
    } else {
      acc.push({ name: role, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderPieChart = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-64" />;
    }

    if (users.length === 0) {
      return <p>No user data available.</p>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={roleData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {
              roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">System Overview</h3>
                <p>Welcome to the admin dashboard. Here, you can monitor system status, manage users, and analyze data.</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>User Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderPieChart()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role || 'user'}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="analytics">
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p>Detailed analytics and reporting will be available soon.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
