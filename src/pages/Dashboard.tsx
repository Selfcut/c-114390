
import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { UserWelcome } from "../components/UserWelcome";
import { TabNav } from "../components/TabNav";
import { useToast } from "@/hooks/use-toast";
import { Calendar, BarChart3, BookOpen, Users, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { CommunityActivity } from "@/components/dashboard/CommunityActivity";
import { RecommendationsRow } from "../components/RecommendationsRow";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Define interfaces for our data
interface ProgressData {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  recentActivity?: string;
  streakDays?: number;
}

interface UserActivity {
  id: string;
  user_id: string;
  event_type: string;
  metadata: any;
  created_at: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real user activities and progress from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // This is a fallback to demo data since we may not have actual learning progress in the DB yet
        // In a real app, you'd have a proper learning_progress table
        const mockProgressData = [
          {
            id: "1",
            title: "Systems Thinking",
            description: "Explore interconnected systems",
            progress: 45,
            icon: "brain",
            recentActivity: "Last studied: Introduction to Feedback Loops",
            streakDays: 3
          },
          {
            id: "2",
            title: "Quantum Mechanics",
            description: "Physics at the quantum scale",
            progress: 68,
            icon: "target",
            recentActivity: "Last studied: Wave-Particle Duality",
            streakDays: 5
          },
          {
            id: "3",
            title: "Mathematical Logic",
            description: "Formal systems and proofs",
            progress: 32,
            icon: "book",
            recentActivity: "Last studied: First-Order Logic"
          },
          {
            id: "4",
            title: "Philosophy of Mind",
            description: "Consciousness and cognition",
            progress: 87,
            icon: "trend",
            recentActivity: "Last studied: The Hard Problem",
            streakDays: 12
          }
        ];
        
        setProgressData(mockProgressData);
        
        // Fetch real user activities from Supabase
        const { data: activities, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Error fetching user activities:", error);
          // We'll use empty array if there's an error
          setUserActivities([]);
        } else {
          setUserActivities(activities || []);
        }
      } catch (error) {
        console.error("Error in dashboard data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, isAuthenticated]);

  // Get user data with fallback to localStorage for name
  const userName = user?.name || localStorage.getItem('userName') || "Scholar";

  // Badges for gamification (would come from user profile in a real implementation)
  const userBadges = [
    { name: "Early Adopter", icon: "sparkles", achieved: true },
    { name: "First Post", icon: "message", achieved: true },
    { name: "Knowledge Seeker", icon: "book", achieved: false },
    { name: "Deep Thinker", icon: "brain", achieved: false },
    { name: "Community Builder", icon: "users", achieved: false }
  ];
  
  // Tabs for dashboard sections
  const dashboardTabs = [
    {
      id: "progress",
      label: "Learning Progress",
      icon: <BarChart3 size={16} className="mr-1" />,
      content: isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <Skeleton className="h-5 w-36 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full my-4" />
              <Skeleton className="h-4 w-40 mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <LearningProgress 
          progressData={progressData}
          onCardClick={(item) => toast({
            title: "Content opened",
            description: `You opened: ${item.title}`,
          })}
        />
      )
    },
    {
      id: "upcoming",
      label: "Upcoming Events",
      icon: <Calendar size={16} className="mr-1" />,
      content: <UpcomingEvents />
    },
    {
      id: "resources",
      label: "Latest Resources",
      icon: <BookOpen size={16} className="mr-1" />,
      content: (
        <div className="animate-fade-in">
          <RecommendationsRow />
        </div>
      )
    },
    {
      id: "community",
      label: "Community Activity",
      icon: <Users size={16} className="mr-1" />,
      content: <CommunityActivity />
    }
  ];

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        {isLoading ? (
          <div className="mb-6 p-6 border rounded-lg">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-7 w-48 mb-3" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <div className="flex gap-4 mt-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <UserWelcome 
            userName={userName}
            level={5}
            xp={1240}
            nextLevelXp={2000}
            badges={userBadges.filter(badge => badge.achieved).length}
            totalBadges={userBadges.length}
            activityStreak={3}
          />
        )}
        
        <TabNav tabs={dashboardTabs} defaultTab="progress" className="mb-6" />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400" />
              Recent Activity
              <Badge className="ml-2 bg-primary/20 text-primary">New</Badge>
            </h2>
          </div>
          <ActivityFeed userActivities={userActivities} isLoading={isLoading} />
        </div>
      </main>
    </PageLayout>
  );
};

export default Dashboard;
