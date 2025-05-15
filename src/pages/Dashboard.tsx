
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
  user?: {
    name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface ProfileData {
  level?: number;
  xp?: number;
  nextLevelXp?: number;
  badges?: number;
  totalBadges?: number;
  activityStreak?: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    badges: 0,
    totalBadges: 5,
    activityStreak: 0
  });
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
        // Fetch user activities
        const { data: activities, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (activitiesError) {
          console.error("Error fetching user activities:", activitiesError);
        } else {
          // Then fetch user data for each activity separately
          if (activities && activities.length > 0) {
            const activitiesWithUsers = await Promise.all(
              activities.map(async (activity) => {
                // Get user data for each activity
                const { data: userData } = await supabase
                  .from('profiles')
                  .select('name, username, avatar_url')
                  .eq('id', activity.user_id)
                  .single();
                  
                return {
                  ...activity,
                  user: userData || { name: 'Unknown User', username: 'unknown' }
                } as UserActivity;
              })
            );
            setUserActivities(activitiesWithUsers);
          } else {
            setUserActivities([]);
          }
        }

        // Calculate user stats based on activities
        if (activities) {
          // Calculate streak based on activities in consecutive days
          const dates = activities.map(a => new Date(a.created_at).toDateString());
          const uniqueDates = [...new Set(dates)].sort();
          
          // Simple streak calculation - in a real app this would be more sophisticated
          let streak = 0;
          const today = new Date().toDateString();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toDateString();
          
          if (uniqueDates.includes(today)) {
            streak = 1;
            let checkDate = yesterday;
            let dateString = checkDate.toDateString();
            
            while (uniqueDates.includes(dateString)) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
              dateString = checkDate.toDateString();
            }
          } else if (uniqueDates.includes(yesterdayString)) {
            streak = 1;
            let checkDate = new Date(yesterday);
            checkDate.setDate(checkDate.getDate() - 1);
            let dateString = checkDate.toDateString();
            
            while (uniqueDates.includes(dateString)) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
              dateString = checkDate.toDateString();
            }
          }
          
          // Calculate XP - 10 points per activity
          const xp = activities.length * 10;
          const level = Math.max(1, Math.floor(xp / 100) + 1);
          const nextLevelXp = level * 100;
          
          // Count "achievements" as activities with type 'achievement'
          const badgeCount = activities.filter(a => a.event_type === 'achievement').length;
          
          setProfileData({
            level,
            xp,
            nextLevelXp,
            badges: badgeCount,
            totalBadges: 5,
            activityStreak: streak
          });
        }

        // For learning progress, we'll use a mix of real data and enhanced mock data
        // In a production app, we would have a dedicated learning_progress table
        const learningTopics = ['Systems Thinking', 'Quantum Mechanics', 'Mathematical Logic', 'Philosophy of Mind'];
        const { data: quoteData } = await supabase
          .from('quotes')
          .select('category')
          .eq('user_id', user.id);
        
        // Get categories the user has quoted
        const userCategories = quoteData ? [...new Set(quoteData.map(q => q.category))] : [];
        
        // Add user categories to our topics if they don't exist
        userCategories.forEach(category => {
          if (category && !learningTopics.includes(category)) {
            learningTopics.push(category);
          }
        });
        
        // Create progress data based on user activities and quotes
        const mockProgressData = learningTopics.map((topic, index) => {
          // Generate more realistic progress based on user activities
          let progress = Math.floor(Math.random() * 80) + 10;
          let streakDays = index % 3 === 0 ? Math.floor(Math.random() * 7) + 1 : undefined;
          
          // If this topic is one the user has quoted, give it higher progress
          if (userCategories.includes(topic)) {
            progress = Math.floor(Math.random() * 30) + 70; // 70-100% progress
            streakDays = Math.floor(Math.random() * 10) + 5; // 5-15 day streak
          }
          
          return {
            id: (index + 1).toString(),
            title: topic,
            description: `Explore ${topic.toLowerCase()}`,
            progress,
            icon: ['brain', 'target', 'book', 'trend'][index % 4],
            recentActivity: `Last studied: Introduction to ${topic}`,
            streakDays
          };
        });
        
        setProgressData(mockProgressData);
      } catch (error) {
        console.error("Error in dashboard data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, isAuthenticated]);

  // Get user name with fallback
  const userName = user?.name || localStorage.getItem('userName') || "Scholar";

  // Badges for gamification (would come from user profile in a real implementation)
  const userBadges = [
    { name: "Early Adopter", icon: "sparkles", achieved: true },
    { name: "First Post", icon: "message", achieved: true },
    { name: "Knowledge Seeker", icon: "book", achieved: profileData.level >= 2 },
    { name: "Deep Thinker", icon: "brain", achieved: profileData.level >= 3 },
    { name: "Community Builder", icon: "users", achieved: profileData.level >= 5 }
  ];
  
  // Calculate achieved badges count
  const achievedBadges = userBadges.filter(badge => badge.achieved).length;
  
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
            level={profileData.level || 1}
            xp={profileData.xp || 0}
            nextLevelXp={profileData.nextLevelXp || 100}
            badges={achievedBadges}
            totalBadges={userBadges.length}
            activityStreak={profileData.activityStreak || 0}
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
          <ActivityFeed limit={10} />
        </div>
      </main>
    </PageLayout>
  );
};

export default Dashboard;
