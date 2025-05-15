
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Eye, EyeOff, Github, Mail } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Password validation
  useEffect(() => {
    if (!password) {
      setPasswordError(null);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError(null);
    }
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordError) {
      toast({
        title: "Invalid password",
        description: passwordError,
        variant: "destructive"
      });
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: "Check your email to confirm your account",
        });
        
        // In development, we can automatically log in
        if (import.meta.env.DEV) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive"
      });
      return;
    }
    
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    }).then(({data, error}) => {
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your inbox for further instructions",
        });
      }
    });
  };

  const handleGithubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src="/logo.svg" alt="Polymath Logo" className="h-12 w-12" />
        </div>
        
        <Card className="border-gray-800 shadow-lg bg-[#1A1A1A]">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Polymath</CardTitle>
            <CardDescription className="text-gray-400">
              The intellectual science community
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 focus:border-[#6E59A5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button 
                        type="button" 
                        className="text-sm text-[#6E59A5] hover:underline"
                        onClick={handleResetPassword}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 focus:border-[#6E59A5] pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#6E59A5] hover:bg-[#7E69B5]" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#1A1A1A] px-2 text-gray-400">or continue with</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-gray-700"
                      onClick={handleGithubLogin}
                    >
                      <Github size={18} className="mr-2" />
                      GitHub
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-gray-700"
                      onClick={() => {
                        toast({
                          title: "Coming soon",
                          description: "This login method will be available soon",
                        });
                      }}
                    >
                      <Mail size={18} className="mr-2" />
                      Google
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 focus:border-[#6E59A5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 focus:border-[#6E59A5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <div className="relative">
                      <Input
                        id="password-register"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className={`bg-gray-800 border-gray-700 focus:border-[#6E59A5] pr-10 ${
                          passwordError ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        {passwordError}
                      </p>
                    )}
                    {password && !passwordError && (
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <CheckCircle size={12} />
                        Password strength: Good
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        minLength={6}
                        className={`bg-gray-800 border-gray-700 focus:border-[#6E59A5] pr-10 ${
                          passwordConfirm && password !== passwordConfirm ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordConfirm && password !== passwordConfirm && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} />
                        Passwords don't match
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#6E59A5] hover:bg-[#7E69B5]" 
                    disabled={loading || (passwordConfirm && password !== passwordConfirm)}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
                
                <div className="px-6 py-2">
                  <p className="text-xs text-gray-400 text-center">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <p className="text-center text-sm text-gray-400">
          <a href="/" className="text-[#6E59A5] hover:underline">
            Return to Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
