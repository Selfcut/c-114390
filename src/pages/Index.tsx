import { useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { QuickStartItem } from "../components/QuickStartItem";
import { FeaturedAppCard } from "../components/FeaturedAppCard";
import { ModelCard } from "../components/ModelCard";
import { BookOpen, MessageSquare, Users, Library, Book, MessageSquare as ForumIcon, MessageSquare as DiscordIcon } from "lucide-react";

const Index = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <h1 className="text-3xl font-bold text-white mb-8">
                Explore Intellectual Frontiers
              </h1>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <CreationCard type="discussion" />
                <CreationCard type="knowledge" />
              </div>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Knowledge Pathways
                </h2>
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
                      <ForumIcon size={24} className="text-[#00A67E]" />
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
                      <DiscordIcon size={24} className="text-[#FF3EA5]" />
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
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Featured Disciplines
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FeaturedAppCard 
                    title="Mathematics & Logic"
                    subtitle="Foundational Thinking"
                    imageSrc="/lovable-uploads/12cd0679-f352-498e-a6ad-9faaa1ffbec9.png"
                    isNew
                  />
                  <FeaturedAppCard 
                    title="Physics & Astronomy"
                    subtitle="Natural Sciences"
                    imageSrc="/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png"
                  />
                  <FeaturedAppCard 
                    title="Philosophy & Ethics"
                    subtitle="Conceptual Frameworks"
                    imageSrc="/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png"
                  />
                  <FeaturedAppCard 
                    title="Computer Science"
                    subtitle="Computational Thinking"
                    imageSrc="/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <FeaturedAppCard 
                    title="Literature & Arts"
                    subtitle="Creative Expression"
                    imageSrc="/lovable-uploads/4255fa40-8036-4424-a210-e3bcd99754df.png"
                  />
                  <FeaturedAppCard 
                    title="History & Anthropology"
                    subtitle="Human Evolution"
                    imageSrc="/lovable-uploads/0c6db754-b805-46e5-a4b8-319a9d8fef71.png"
                  />
                  <FeaturedAppCard 
                    title="Biology & Medicine"
                    subtitle="Life Sciences"
                    imageSrc="/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png"
                  />
                  <FeaturedAppCard 
                    title="Psychology & Cognition"
                    subtitle="Mind Sciences"
                    imageSrc="/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png"
                  />
                </div>
                
                <div className="flex justify-center mt-8">
                  <button className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium">
                    Explore All Disciplines
                    <BookOpen size={16} />
                  </button>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Learning Methodologies
                </h2>
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
                  <button className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium">
                    View All Methods
                    <BookOpen size={16} />
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
