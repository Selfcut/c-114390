
import { useState, useEffect } from 'react';
import { X, BookOpen, Users, MessageSquare, Library, Quote, Star } from 'lucide-react';
import { polymathToast } from "../components/ui/use-toast";

export const WelcomeOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);
  
  const closeOverlay = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('userName', userName);
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    if (learningStyle) {
      localStorage.setItem('learningStyle', learningStyle);
    }
    
    if (currentStep === 4) {
      polymathToast.welcomeBack(0);
      if (selectedInterests.length > 0) {
        polymathToast.contentRecommended();
      }
    }
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };
  
  const interests = [
    "Mathematics",
    "Physics",
    "Philosophy",
    "Computer Science",
    "Psychology",
    "History",
    "Literature",
    "Biology",
    "Economics",
    "Art",
    "Music",
    "Linguistics",
    "Astronomy",
    "Chemistry",
    "Ancient Wisdom",
    "Mysticism"
  ];
  
  const learningStyles = [
    { id: 'visual', label: 'Visual Learner', description: 'You prefer using pictures, images, and spatial understanding' },
    { id: 'auditory', label: 'Auditory Learner', description: 'You prefer using sound and music' },
    { id: 'reading', label: 'Reading/Writing', description: 'You prefer using words, reading and writing' },
    { id: 'kinesthetic', label: 'Kinesthetic', description: 'You prefer using your body, hands and sense of touch' }
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl w-full max-w-xl relative overflow-hidden">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={closeOverlay}
        >
          <X size={20} />
        </button>
        
        {/* Step 1: Welcome */}
        {currentStep === 0 && (
          <div className="p-8">
            <img
              src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" 
              alt="Polymath Logo" 
              className="w-20 h-20 mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-white text-center mb-4">Welcome to Polymath</h2>
            <p className="text-gray-300 text-center mb-6">
              Your journey toward intellectual growth across diverse disciplines begins here.
            </p>
            
            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-[#00361F] flex-shrink-0">
                  <BookOpen size={18} className="text-[#00A67E]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Explore Knowledge</h3>
                  <p className="text-sm text-gray-400">Access curated content across multiple disciplines</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-[#360036] flex-shrink-0">
                  <MessageSquare size={18} className="text-[#FF3EA5]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Join Discussions</h3>
                  <p className="text-sm text-gray-400">Engage in deep intellectual discourse</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-[#3A3600] flex-shrink-0">
                  <Users size={18} className="text-[#FFD426]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Connect With Others</h3>
                  <p className="text-sm text-gray-400">Meet like-minded individuals and experts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-[#003619] flex-shrink-0">
                  <Quote size={18} className="text-[#00A67E]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Share Wisdom</h3>
                  <p className="text-sm text-gray-400">Contribute to our collection of timeless knowledge</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Your Name */}
        {currentStep === 1 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What should we call you?</h2>
            <div className="mb-8">
              <label className="block text-sm text-gray-400 mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
              />
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={nextStep}
                disabled={!userName.trim()}
                className={`${!userName.trim() ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-md transition-colors`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Interests */}
        {currentStep === 2 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Select your interests</h2>
            <p className="text-gray-400 mb-6">
              Pick at least 3 topics that interest you most
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8 max-h-64 overflow-y-auto pr-2">
              {interests.map((interest, index) => (
                <button
                  key={index}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-2 rounded-md text-sm ${
                    selectedInterests.includes(interest)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={nextStep}
                disabled={selectedInterests.length < 3}
                className={`${selectedInterests.length < 3 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-md transition-colors`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Learning Style */}
        {currentStep === 3 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">How do you learn best?</h2>
            <p className="text-gray-400 mb-6">
              This helps us personalize your content experience
            </p>
            
            <div className="space-y-3 mb-8">
              {learningStyles.map((style) => (
                <div 
                  key={style.id}
                  className={`p-4 rounded-lg cursor-pointer border ${
                    learningStyle === style.id 
                      ? 'border-blue-600 bg-blue-900 bg-opacity-20' 
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                  onClick={() => setLearningStyle(style.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">{style.label}</h3>
                    {learningStyle === style.id && (
                      <div className="bg-blue-600 rounded-full p-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{style.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 5: Final */}
        {currentStep === 4 && (
          <div className="p-8">
            <div className="mb-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <div className="text-white text-2xl">✓</div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                You're all set, {userName}!
              </h2>
              <p className="text-gray-400 text-center">
                Welcome to the intellectual community of Polymath
              </p>
            </div>
            
            <div className="bg-[#222222] p-4 rounded-lg mb-6">
              <h3 className="font-medium text-white mb-2">Personalized for you</h3>
              <p className="text-sm text-gray-400">
                Based on your interests, we've prepared recommendations in {selectedInterests.slice(0, 3).join(", ")} and {selectedInterests.length - 3} more areas.
              </p>
            </div>
            
            <div className="bg-[#222222] p-4 rounded-lg mb-6">
              <h3 className="font-medium text-white mb-2">Your badges await</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center bg-gray-800 rounded-full px-2 py-1">
                  <Star size={14} className="text-yellow-500 mr-1" />
                  <span className="text-xs text-gray-300">New Polymath</span>
                </div>
                <div className="flex items-center bg-gray-800 rounded-full px-2 py-1">
                  <BookOpen size={14} className="text-blue-400 mr-1" />
                  <span className="text-xs text-gray-300">Knowledge Seeker</span>
                </div>
                <div className="flex items-center bg-gray-800 rounded-full px-2 py-1">
                  <MessageSquare size={14} className="text-green-400 mr-1" />
                  <span className="text-xs text-gray-300">Community Member</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={closeOverlay}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-colors"
              >
                Start Exploring
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="bg-gray-800 h-1 w-full">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep + 1) * 20}%` }}
          />
        </div>
      </div>
    </div>
  );
};
