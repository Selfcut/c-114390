import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LoadingScreen } from '@/components/LoadingScreen';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  console.log("Auth page - isAuthenticated:", isAuthenticated);
  
  // Check for error param in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'callback_error') {
      setError('There was a problem processing your authentication. Please try again.');
    }
  }, [searchParams]);
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    if (!email) {
      setError('Email is required.');
      return false;
    }
    
    if (!password) {
      setError('Password is required.');
      return false;
    }
    
    if (activeTab === "signup") {
      if (!name) {
        setError('Name is required.');
        return false;
      }
      
      if (!username) {
        setError('Username is required.');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (activeTab === "login") {
        console.log("Signing in with email:", email);
        const result = await signIn(email, password);
        
        if (result?.error) {
          console.error("Sign in error:", result.error);
          setError(result.error.message || 'Failed to sign in.');
          setLoading(false);
          return;
        }
        
        toast({
          title: "Signed in successfully",
          description: "Welcome back!"
        });
        
        navigate('/dashboard');
      } else {
        console.log("Signing up with email:", email);
        const result = await signUp(email, password, username, name);
        
        if (result?.error) {
          console.error("Sign up error:", result.error);
          setError(result.error.message || 'Failed to sign up.');
          setLoading(false);
          return;
        }
        
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account."
        });
        
        // Switch to login tab after successful registration
        setActiveTab("login");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setError(null);
    setActiveTab(value as "login" | "signup");
  };

  // Already showing loading state during redirect
  if (isLoading) {
    return <LoadingScreen message="Loading authentication state..." />;
  }

  // Redirect immediately if authenticated
  if (isAuthenticated) {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }

  return (
    <div className="container relative h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-background border">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Polymath</h1>
          <p className="text-muted-foreground">Intellectual Science Community</p>
        </div>
        
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full mt-6" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="#" onClick={() => setActiveTab("signup")} className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  placeholder="Confirm your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full mt-6" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="#" onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>By using this service, you agree to our</p>
          <div className="flex justify-center gap-2 mt-1">
            <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
            <span>and</span>
            <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
