
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { PromoBar } from "@/components/PromoBar";
import { Sidebar } from "@/components/Sidebar";
import { BookOpen, MessageSquare, Users, Database, Calendar, Target, BookMarked, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  username?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      const { user } = session;
      
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          username: user.user_metadata.username || user.email?.split('@')[0]
        });
      }
      
      setLoading(false);
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.username || session.user.email?.split('@')[0]
        });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-8 lg:px-12">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.username || 'Scholar'}</h1>
                <p className="text-muted-foreground">Your personal knowledge dashboard</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <Progress value={68} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      17 of 25 topics completed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Contributions in the last week
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Reading List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Books in your reading queue
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Unread messages in discussions
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Your Current Focus</CardTitle>
                      <CardDescription>Track your learning path progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Hermetic Principles</div>
                            <div className="text-sm text-muted-foreground">75%</div>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Ancient Symbolism</div>
                            <div className="text-sm text-muted-foreground">45%</div>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Esoteric Philosophy</div>
                            <div className="text-sm text-muted-foreground">90%</div>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button asChild>
                          <Link to="/library" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>Continue Learning</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Upcoming Events</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Sacred Geometry Workshop</h4>
                            <p className="text-sm text-muted-foreground">Tomorrow, 6:00 PM</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Book Club: The Kybalion</h4>
                            <p className="text-sm text-muted-foreground">Saturday, 3:30 PM</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full">View All Events</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookMarked className="h-5 w-5 text-primary" />
                          <span>Recommended Reading</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">The Secret Teachings of All Ages</h4>
                            <p className="text-sm text-muted-foreground">Manly P. Hall</p>
                          </div>
                          <div>
                            <h4 className="font-medium">The Hero with a Thousand Faces</h4>
                            <p className="text-sm text-muted-foreground">Joseph Campbell</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full">View All Books</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>Latest Discussions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h4 className="font-medium">The Nature of Consciousness</h4>
                          <p className="text-xs text-muted-foreground">23 replies · 1h ago</p>
                        </div>
                        <div className="border-b pb-2">
                          <h4 className="font-medium">Modern Applications of Alchemy</h4>
                          <p className="text-xs text-muted-foreground">17 replies · 3h ago</p>
                        </div>
                        <div className="border-b pb-2">
                          <h4 className="font-medium">Interpreting Sacred Texts</h4>
                          <p className="text-xs text-muted-foreground">8 replies · 5h ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        <Link to="/forum">Join Discussions</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Community</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">JS</div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">AL</div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">RK</div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">MT</div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">+5</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect with fellow scholars and discuss ideas in real-time.
                      </p>
                      <Button asChild className="w-full">
                        <Link to="/chat" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Open Chat</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
