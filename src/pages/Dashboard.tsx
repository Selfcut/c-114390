
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { UserWelcome } from "../components/UserWelcome";
import { ProgressCard } from "../components/ProgressCard";
import { RecommendationsRow } from "../components/RecommendationsRow";
import { TabNav } from "../components/TabNav";
import { useToast } from "@/hooks/use-toast";
import { Calendar, BarChart3, BookOpen, Users } from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  const userName = localStorage.getItem('userName') || "Scholar";
  
  // Simulated progress data
  const progressData = [
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
  
  // Tabs for dashboard sections
  const dashboardTabs = [
    {
      id: "progress",
      label: "Learning Progress",
      icon: <BarChart3 size={16} className="mr-1" />,
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade">
            {progressData.map((item, index) => (
              <ProgressCard
                key={item.id}
                title={item.title}
                description={item.description}
                progress={item.progress}
                icon={item.icon as any}
                recentActivity={item.recentActivity}
                streakDays={item.streakDays}
                animationDelay={`${index * 0.1}s`}
                onClick={() => toast({
                  title: "Content opened",
                  description: `You opened: ${item.title}`,
                })}
              />
            ))}
          </div>
          <RecommendationsRow />
        </div>
      )
    },
    {
      id: "upcoming",
      label: "Upcoming Events",
      icon: <Calendar size={16} className="mr-1" />,
      content: (
        <div className="animate-fade-in">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You don't have any scheduled events. Join a study group or schedule a discussion to see events here.
            </p>
            <button className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md transition-colors hover-lift">
              Browse Study Groups
            </button>
          </div>
        </div>
      )
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
      content: (
        <div className="animate-fade-in">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Community Activity</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Stay connected with the latest discussions, contributions, and activities from the community.
            </p>
            <button 
              className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md transition-colors hover-lift"
              onClick={() => toast({
                title: "Coming soon",
                description: "This feature will be available in the next update",
              })}
            >
              View Activity Feed
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-6 md:px-12">
              <UserWelcome userName={userName} />
              <TabNav tabs={dashboardTabs} defaultTab="progress" className="mb-6" />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
