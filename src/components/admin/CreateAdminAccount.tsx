
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield } from "lucide-react";

export function CreateAdminAccount() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !adminSecretKey) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { email, password, adminSecretKey },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      toast({
        title: "Admin created successfully",
        description: `${email} has been created with admin privileges`,
      });
      
      // Clear the form
      setEmail("");
      setPassword("");
      setAdminSecretKey("");
      
    } catch (error) {
      toast({
        title: "Failed to create admin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          Create Admin Account
        </CardTitle>
        <CardDescription>
          Create a new admin user with full privileges
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secure password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminSecretKey">Admin Secret Key</Label>
            <Input
              id="adminSecretKey"
              type="password"
              value={adminSecretKey}
              onChange={(e) => setAdminSecretKey(e.target.value)}
              placeholder="Secret key for admin creation"
              required
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating Admin...
              </>
            ) : (
              "Create Admin Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
