
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Trash2, Settings, Edit, MoreHorizontal, Plus, UserPlus, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

  // Add user form state
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "user"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Get users from Supabase Auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Transform the data
      const formattedUsers = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
        avatar: user.user_metadata?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${user.id}`,
        role: user.user_metadata?.role || 'user',
        created_at: new Date(user.created_at).toLocaleString(),
        last_sign_in_at: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : null
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Failed to fetch users",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.password || !newUser.name) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          name: newUser.name,
          role: newUser.role
        }
      });

      if (error) throw error;

      toast({
        title: "User Created",
        description: "The user has been successfully added."
      });

      // Reset form and close dialog
      setNewUser({ email: "", password: "", name: "", role: "user" });
      setIsAddUserOpen(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Failed to Create User",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "User Deleted",
        description: "The user has been successfully removed."
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Failed to Delete User",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with the specified role.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
                <Input 
                  id="name" 
                  value={newUser.name} 
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  placeholder="User's full name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input 
                  id="email" 
                  type="email"
                  value={newUser.email} 
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="user@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input 
                  id="password" 
                  type="password"
                  value={newUser.password} 
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Create a strong password"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role">Role</label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(role) => setNewUser({...newUser, role})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full border-2 border-t-primary animate-spin mb-3" />
                      <span className="text-muted-foreground">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Shield className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : user.role === 'moderator'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <TableCell>{user.last_sign_in_at || 'Never'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Manage Roles</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
