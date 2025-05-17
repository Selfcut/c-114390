
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

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Check for error param in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'callback_error') {
      setError('There was a problem processing your authentication. Please try again.');
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
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
    
    if (!isLogin) {
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
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message || 'Failed to sign in.');
        } else {
          toast({
            title: "Sign in successful",
            description: "Welcome back!"
          });
          navigate('/dashboard');
        }
      } else {
        const userData = {
          name,
          username: email.split('@')[0],
        };
        
        const { error: signUpError } = await signUp(email, password, userData);
        if (signUpError) {
          setError(signUpError.message || 'Failed to sign up.');
        } else {
          toast({
            title: "Sign up successful",
            description: "Please check your email to verify your account."
          });
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setError(null);
    setIsLogin(value === 'login');
  };

  return (
    <div className="container relative h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-background border">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Polymath</h1>
          <p className="text-muted-foreground">Intellectual Science Community</p>
        </div>
        
        <Tabs defaultValue={isLogin ? "login" : "signup"} className="w-full" onValueChange={handleTabChange}>
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
              <Link to="/auth" onClick={() => setIsLogin(false)} className="text-primary hover:underline">
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
              <Link to="/auth" onClick={() => setIsLogin(true)} className="text-primary hover:underline">
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
