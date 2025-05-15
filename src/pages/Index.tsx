import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { BookOpen, MessageSquare, Users, Library, Book, Sparkles, Calendar, BrainCircuit, Search, Quote } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";
import { disciplines, formatDaysAgo } from "../lib/utils";
import { WelcomeExploration } from "../components/WelcomeExploration";
import { MysticalTopicsSection } from "../components/MysticalTopicsSection";
import { FeaturedBooksSection } from "../components/FeaturedBooksSection";
import { CommunitySection } from "../components/CommunitySection";
import { MembershipBenefits } from "../components/MembershipBenefits";
import { CollapsibleSection } from "../components/CollapsibleSection";
import { KnowledgeBrowser } from "../components/KnowledgeBrowser";
import { ReadingList } from "../components/ReadingProgress";

// Create a new component for discussion topics
const DiscussionTopicItem = ({ title, author, replies, timeAgo }: { title: string, author: string, replies: number, timeAgo: string }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-gray-800">
    <div className="p-2 rounded-full bg-[#00361F]">
      <MessageSquare size={16} className="text-[#00A67E]" />
    </div>
    <div>
      <h4 className="text-white font-medium text-sm">{title}</h4>
      <p className="text-xs text-gray-400 mt-1">
        {author} • {replies} replies • {timeAgo}
      </p>
    </div>
  </div>
);

// Create a new component for knowledge entries
const KnowledgeEntryItem = ({ title, author, readTime, timeAgo }: { title: string, author: string, readTime: string, timeAgo: string }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-gray-800">
    <div className="p-2 rounded-full bg-[#360036]">
      <Book size={16} className="text-[#FF3EA5]" />
    </div>
    <div>
      <h4 className="text-white font-medium text-sm">{title}</h4>
      <p className="text-xs text-gray-400 mt-1">
        {author} • {readTime} • {timeAgo}
      </p>
    </div>
  </div>
);

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [recentVisit, setRecentVisit] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'all'>('popular');
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

  const handleSortChange = (option: 'popular' | 'new' | 'all') => {
    setSortOption(option);
    if (option === 'new') {
      polymathToast.searchComplete(disciplines.length);
    }
  };

  // New function to show the join study group toast
  const handleJoinGroup = () => {
    polymathToast.joinedStudyGroup();
  };

  // New function to show event registration toast
  const handleEventRegistration = () => {
    polymathToast.eventRegistered();
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
              {showWelcome && recentVisit && (
                <div className="bg-[#1A1A1A] rounded-lg p-4 mb-8 flex justify-between items-center animate-fade-in">
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Welcome back!</span> Your last visit was {recentVisit}. 
                    There have been {newDiscussions} new discussions and {newEntries} new knowledge entries since then.
                  </p>
                  <button 
                    onClick={dismissWelcome} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            
              <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Explore Intellectual Frontiers
              </h1>
              
              {/* Welcome and Exploration Banner */}
              <WelcomeExploration />
              
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
              <CollapsibleSection title="Your Learning Progress" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <UserProgressCard 
                    discipline="Mathematics & Logic"
                    progress={65}
                    nextMilestone="Advanced Set Theory"
                    daysStreak={12}
                  />
                  <UserProgressCard 
                    discipline="Philosophy"
                    progress={38}
                    nextMilestone="Ethics & Moral Philosophy"
                    daysStreak={7}
                  />
                  <UserProgressCard 
                    discipline="Physics"
                    progress={27}
                    nextMilestone="Quantum Mechanics Basics"
                    daysStreak={3}
                  />
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3 justify-center items-center">
                    <div className="p-3 rounded-full bg-blue-900">
                      <BrainCircuit size={24} className="text-blue-400" />
                    </div>
                    <p className="text-center text-white font-medium">Explore More Disciplines</p>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm py-1.5 px-4 rounded">
                      Browse All
                    </button>
                  </div>
                </div>
              </CollapsibleSection>
              
              {/* Knowledge Pathways */}
              <CollapsibleSection title="Knowledge Pathways" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
                      <BookOpen size={24} className="text-[#FFD426]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">Interdisciplinary Studies</h3>
                        <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                          New
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Connect concepts across fields</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="p-3 rounded-lg bg-[#00361F] mr-4 flex items-center justify-center">
                      <MessageSquare size={24} className="text-[#00A67E]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Discussion Forums</h3>
                      <p className="text-sm text-gray-400 mt-1">Engage in intellectual discourse</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="p-3 rounded-lg bg-[#360036] mr-4 flex items-center justify-center">
                      <Book size={24} className="text-[#FF3EA5]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Knowledge Library</h3>
                      <p className="text-sm text-gray-400 mt-1">Access our curated wiki resources</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="p-3 rounded-lg bg-[#36003B] mr-4 flex items-center justify-center">
                      <MessageSquare size={24} className="text-[#FF3EA5]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Discord Community</h3>
                      <p className="text-sm text-gray-400 mt-1">Join real-time discussions</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
                      <Users size={24} className="text-[#FFD426]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Mentorship Network</h3>
                      <p className="text-sm text-gray-400 mt-1">Connect with fellow polymaths</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="p-3 rounded-lg bg-[#003619] mr-4 flex items-center justify-center">
                      <MessageSquare size={24} className="text-[#00A67E]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Expert Q&A</h3>
                      <p className="text-sm text-gray-400 mt-1">Ask questions, get scholarly answers</p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
              
              {/* Featured Disciplines */}
              <CollapsibleSection title="Featured Disciplines" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex justify-end mb-4">
                  <div className="flex gap-2">
                    <button 
                      className={`px-3 py-1 text-sm rounded-md ${sortOption === 'popular' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'}`}
                      onClick={() => handleSortChange('popular')}
                    >
                      Popular
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-md ${sortOption === 'new' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'}`}
                      onClick={() => handleSortChange('new')}
                    >
                      New
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-md ${sortOption === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'}`}
                      onClick={() => handleSortChange('all')}
                    >
                      All
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mb-4">
                  <div className="flex gap-2 bg-gray-800 p-1 rounded-md">
                    <button 
                      className={`p-2 rounded ${displayMode === 'grid' ? 'bg-gray-700' : ''}`}
                      onClick={() => setDisplayMode('grid')}
                      title="Grid view"
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2 h-2 bg-current"></div>
                        <div className="w-2 h-2 bg-current"></div>
                        <div className="w-2 h-2 bg-current"></div>
                        <div className="w-2 h-2 bg-current"></div>
                      </div>
                    </button>
                    <button 
                      className={`p-2 rounded ${displayMode === 'list' ? 'bg-gray-700' : ''}`}
                      onClick={() => setDisplayMode('list')}
                      title="List view"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="w-4 h-1 bg-current"></div>
                        <div className="w-4 h-1 bg-current"></div>
                        <div className="w-4 h-1 bg-current"></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className={displayMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                  <FeaturedAppCard 
                    title="Mathematics & Logic"
                    subtitle="Foundational Thinking"
                    imageSrc="/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png"
                    isNew
                  />
                  <FeaturedAppCard 
                    title="Physics & Astronomy"
                    subtitle="Natural Sciences"
                    imageSrc="/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png"
                  />
                  <FeaturedAppCard 
                    title="Philosophy & Ethics"
                    subtitle="Conceptual Frameworks"
                    imageSrc="/lovable-uploads/0c6db754-b805-46e5-a4b8-319a9d8fef71.png"
                  />
                  <FeaturedAppCard 
                    title="Computer Science"
                    subtitle="Computational Thinking"
                    imageSrc="/lovable-uploads/12cd0679-f352-498e-a6ad-9faaa1ffbec9.png"
                  />
                </div>
                
                <div className={displayMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6" : "flex flex-col gap-4 mt-6"}>
                  <FeaturedAppCard 
                    title="Literature & Arts"
                    subtitle="Creative Expression"
                    imageSrc="/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png"
                  />
                  <FeaturedAppCard 
                    title="History & Anthropology"
                    subtitle="Human Evolution"
                    imageSrc="/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png"
                  />
                  <FeaturedAppCard 
                    title="Biology & Medicine"
                    subtitle="Life Sciences"
                    imageSrc="/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png"
                  />
                  <FeaturedAppCard 
                    title="Psychology & Cognition"
                    subtitle="Mind Sciences"
                    imageSrc="/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png"
                  />
                </div>
                
                <div className="flex justify-center mt-8">
                  <button className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium">
                    Explore All Disciplines
                    <BookOpen size={16} />
                  </button>
                </div>
              </CollapsibleSection>
              
              {/* Learning Methodologies */}
              <CollapsibleSection title="Learning Methodologies" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ModelCard 
                    title="Create Your Learning Path"
                    subtitle="Personalized education"
                    imageSrc=""
                    isTrainYourOwn={true}
                  />
                  <ModelCard 
                    title="Feynman Technique"
                    subtitle="Teaching to Learn"
                    imageSrc="/lovable-uploads/22f4141e-f83e-4b85-8c93-672e181d999b.png"
                    tags={[
                      { label: 'Beginner', variant: 'blue' },
                      { label: 'Popular', variant: 'green' }
                    ]}
                  />
                  <ModelCard 
                    title="Spaced Repetition"
                    subtitle="Memory Systems"
                    imageSrc="/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png"
                    tags={[
                      { label: 'Intermediate', variant: 'orange' },
                      { label: 'Effective', variant: 'green' }
                    ]}
                  />
                  <ModelCard 
                    title="Deep Work Method"
                    subtitle="Focused Learning"
                    imageSrc="/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png"
                    tags={[
                      { label: 'Advanced', variant: 'orange' },
                      { label: 'Intensive', variant: 'yellow' }
                    ]}
                  />
                </div>
                
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => polymathToast.searchComplete(12)}
                    className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium"
                  >
                    View All Methods
                    <BookOpen size={16} />
                  </button>
                </div>
              </CollapsibleSection>
              
              {/* Wisdom Highlights */}
              <CollapsibleSection title="Wisdom Highlights" defaultOpen={true} className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-full bg-[#360036]">
                      <Quote size={24} className="text-[#FF3EA5]" />
                    </div>
                    <div>
                      <blockquote className="text-white text-lg font-medium italic mb-2 quote-highlight">
                        "The unexamined life is not worth living."
                      </blockquote>
                      <p className="text-gray-400">— Socrates</p>
                    </div>
                  </div>
                  
                  <Link to="/quotes" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <span>Explore our wisdom collection</span>
                    <BookOpen size={16} />
                  </Link>
                </div>
              </CollapsibleSection>
              
              {/* Community Activity */}
              <CollapsibleSection title="Community Activity" defaultOpen={true} className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1A1A1A] p-6 rounded-lg hover-lift">
                    <h3 className="text-xl font-semibold text-white mb-4">Recent Discussions</h3>
                    <div className="space-y-4">
                      <DiscussionTopicItem
                        title="The intersection of quantum physics and consciousness"
                        author="PhilosophicalMind"
                        replies={24}
                        timeAgo="2h ago"
                      />
                      <DiscussionTopicItem
                        title="Mathematical patterns in natural phenomena"
                        author="MathExplorer"
                        replies={18}
                        timeAgo="5h ago"
                      />
                      <DiscussionTopicItem
                        title="Ethical implications of AI advancement"
                        author="EthicsScholar"
                        replies={32}
                        timeAgo="8h ago"
                      />
                    </div>
                    <Link to="/forum" className="inline-block mt-4 text-blue-400 text-sm hover:underline">View all discussions</Link>
                  </div>
                  
                  <div className="bg-[#1A1A1A] p-6 rounded-lg hover-lift">
                    <h3 className="text-xl font-semibold text-white mb-4">New Knowledge Entries</h3>
                    <div className="space-y-4">
                      <KnowledgeEntryItem
                        title="Introduction to Systems Thinking"
                        author="ComplexityScholar"
                        readTime="15 min read"
                        timeAgo="2d ago"
                      />
                      <KnowledgeEntryItem
                        title="The Mathematics of Music: Harmony and Frequency"
                        author="HarmonicsExpert"
                        readTime="12 min read"
                        timeAgo="1w ago"
                      />
                      <KnowledgeEntryItem
                        title="Neural Networks: From Biology to Computation"
                        author="BioComputation"
                        readTime="20 min read"
                        timeAgo="3d ago"
                      />
                    </div>
                    <Link to="/library" className="inline-block mt-4 text-blue-400 text-sm hover:underline">View all entries</Link>
                  </div>
                </div>
              </CollapsibleSection>
              
              {/* Upcoming Events */}
              <CollapsibleSection title="Upcoming Events" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
                        <Calendar size={20} className="text-[#FFD426]" />
                      </div>
                      <span className="text-xs text-blue-400">Jun 15</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mt-4">Virtual Symposium: The Future of Interdisciplinary Research</h3>
                    <p className="text-sm text-gray-400 mt-2">Join leading thinkers for a discussion on breaking down academic silos.</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">125 attendees</span>
                      <button 
                        onClick={handleEventRegistration}  
                        className="text-blue-400 text-sm hover:underline"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-[#360036] mr-4 flex items-center justify-center">
                        <Users size={20} className="text-[#FF3EA5]" />
                      </div>
                      <span className="text-xs text-blue-400">Jun 22</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mt-4">Polymath Reading Group: "Gödel, Escher, Bach"</h3>
                    <p className="text-sm text-gray-400 mt-2">Monthly discussion of Hofstadter's classic exploration of consciousness and formal systems.</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">42 attendees</span>
                      <button 
                        onClick={handleJoinGroup}
                        className="text-blue-400 text-sm hover:underline"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-lg bg-[#00361F] mr-4 flex items-center justify-center">
                        <BrainCircuit size={20} className="text-[#00A67E]" />
                      </div>
                      <span className="text-xs text-blue-400">Jul 3</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mt-4">Workshop: Mental Models for Complex Problem Solving</h3>
                    <p className="text-sm text-gray-400 mt-2">Learn frameworks for approaching problems across multiple domains.</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">78 attendees</span>
                      <button 
                        onClick={() => polymathToast.contentRecommended()}
                        className="text-blue-400 text-sm hover:underline"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => polymathToast.searchComplete(8)}
                    className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium"
                  >
                    View All Events
                    <Calendar size={16} />
                  </button>
                </div>
              </CollapsibleSection>
              
              {/* Quick Search */}
              <CollapsibleSection title="Quick Search" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "1s" }}>
                <div className="bg-[#1A1A1A] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Quick Search</h3>
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                      onClick={() => polymathToast.searchComplete(15)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Quantum Computing
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(28)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Cognitive Biases
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(23)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Game Theory
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(17)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Epistemology
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(11)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Network Science
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(34)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Complex Systems
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(19)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Information Theory
                    </button>
                    <button 
                      onClick={() => polymathToast.searchComplete(22)}
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
                    >
                      Linguistics
                    </button>
                  </div>
                  <div className="mt-6">
                    <input 
                      type="text" 
                      placeholder="Search all topics..." 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
                      onKeyDown={(e) => e.key === 'Enter' && polymathToast.searchComplete(Math.floor(Math.random() * 50) + 10)}
                    />
                  </div>
                </div>
              </CollapsibleSection>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
