
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { BookOpen, MessageSquare, Quote } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";
import { formatDaysAgo } from "../lib/utils";
import { WelcomeExploration } from "../components/WelcomeExploration";
import { MysticalTopicsSection } from "../components/MysticalTopicsSection";
import { FeaturedBooksSection } from "../components/FeaturedBooksSection";
import { CommunitySection } from "../components/CommunitySection";
import { MembershipBenefits } from "../components/MembershipBenefits";
import { CollapsibleSection } from "../components/CollapsibleSection";
import { KnowledgeBrowser } from "../components/KnowledgeBrowser";
import { ReadingList } from "../components/ReadingProgress";
import { QuotesCarousel } from "../components/QuotesCarousel";
import { WelcomeMessage } from "../components/WelcomeMessage";
import { LearningProgress } from "../components/LearningProgress";
import { KnowledgePathways } from "../components/KnowledgePathways";
import { FeaturedDisciplines } from "../components/FeaturedDisciplines";
import { LearningMethodologies } from "../components/LearningMethodologies";
import { WisdomHighlights } from "../components/WisdomHighlights";
import { CommunityActivity } from "../components/CommunityActivity";
import { UpcomingEvents } from "../components/UpcomingEvents";
import { QuickSearch } from "../components/QuickSearch";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [recentVisit, setRecentVisit] = useState<string | null>(null);
  const [newDiscussions, setNewDiscussions] = useState(0);
  const [newEntries, setNewEntries] = useState(0);

  // Check for recent visit
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - lastVisitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setRecentVisit(formatDaysAgo(lastVisitDate));
      setNewDiscussions(Math.floor(Math.random() * 20) + 5);
      setNewEntries(Math.floor(Math.random() * 10) + 3);
      
      // Show welcome back toast for returning users
      if (diffDays > 3) {
        polymathToast.welcomeBack(diffDays);
      }
    }
    
    // Update last visit timestamp
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  // Add a handler to add the logo.svg file if it's missing
  useEffect(() => {
    // Check if the logo exists, if not create a simple one
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo.svg');
        if (response.status === 404) {
          console.log('Logo not found, would create one in a real app');
        }
      } catch (error) {
        console.log('Error checking logo:', error);
      }
    };
    
    checkLogo();
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    polymathToast.resourceBookmarked();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              {/* Replace the old welcome message with our enhanced one */}
              <WelcomeMessage />
            
              <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Explore Intellectual Frontiers
              </h1>
              
              {/* Welcome and Exploration Banner */}
              <WelcomeExploration />
              
              {/* Creation cards */}
              <div className="grid grid-cols-3 gap-6 mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Link to="/forum">
                  <CreationCard type="discussion" />
                </Link>
                <Link to="/library">
                  <CreationCard type="knowledge" />
                </Link>
                <Link to="/quotes">
                  <div className="creation-card bg-gradient-to-br from-[#36003B] to-[#500056] rounded-lg p-6 h-full flex flex-col hover-lift">
                    <div className="mb-4 p-3 rounded-full bg-[#FF3EA5]/20 w-fit">
                      <Quote size={24} className="text-[#FF3EA5]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Share a Quote</h3>
                    <p className="text-gray-300 mb-6">Discover and contribute to our collection of timeless wisdom.</p>
                    <div className="mt-auto">
                      <span className="text-xs text-[#FF3EA5] bg-[#FF3EA5]/10 px-2 py-1 rounded">
                        NEW FEATURE
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Add new Quote Carousel */}
              <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.25s" }}>
                <QuotesCarousel />
              </div>
              
              {/* Membership Benefits */}
              <CollapsibleSection title="Membership Benefits" defaultOpen={true}>
                <MembershipBenefits />
              </CollapsibleSection>
              
              {/* Knowledge Browser */}
              <CollapsibleSection title="Explore Knowledge" defaultOpen={false}>
                <KnowledgeBrowser />
              </CollapsibleSection>
              
              {/* Mystical Topics */}
              <CollapsibleSection title="Mystical Topics" defaultOpen={true}>
                <MysticalTopicsSection />
              </CollapsibleSection>
              
              {/* Featured Books */}
              <CollapsibleSection title="Featured Books" defaultOpen={true}>
                <FeaturedBooksSection />
              </CollapsibleSection>
              
              {/* Reading Progress */}
              <CollapsibleSection title="Reading Progress" defaultOpen={true}>
                <ReadingList />
              </CollapsibleSection>
              
              {/* Community Section */}
              <CollapsibleSection title="Community" defaultOpen={true}>
                <CommunitySection />
              </CollapsibleSection>
              
              {/* User Progress Section */}
              <CollapsibleSection 
                title="Your Learning Progress" 
                defaultOpen={false} 
                className="animate-fade-in mb-8"
                style={{ animationDelay: "0.3s" }}
              >
                <LearningProgress />
              </CollapsibleSection>
              
              {/* Knowledge Pathways */}
              <CollapsibleSection title="Knowledge Pathways" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <KnowledgePathways />
              </CollapsibleSection>
              
              {/* Featured Disciplines */}
              <CollapsibleSection title="Featured Disciplines" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <FeaturedDisciplines />
              </CollapsibleSection>
              
              {/* Learning Methodologies */}
              <CollapsibleSection title="Learning Methodologies" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <LearningMethodologies />
              </CollapsibleSection>
              
              {/* Wisdom Highlights */}
              <CollapsibleSection title="Wisdom Highlights" defaultOpen={true} className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <WisdomHighlights />
              </CollapsibleSection>
              
              {/* Community Activity */}
              <CollapsibleSection title="Community Activity" defaultOpen={true} className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <CommunityActivity />
              </CollapsibleSection>
              
              {/* Upcoming Events */}
              <CollapsibleSection title="Upcoming Events" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
                <UpcomingEvents />
              </CollapsibleSection>
              
              {/* Quick Search */}
              <CollapsibleSection title="Quick Search" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "1s" }}>
                <QuickSearch />
              </CollapsibleSection>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
