
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  Library, 
  MessageSquare, 
  BookOpen, 
  Shield 
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { WelcomeExploration } from '@/components/WelcomeExploration';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to Polymath
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Unlock your potential with AI-powered learning tools.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild>
            <Link to="/library">
              Explore Library <Library className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <WelcomeExploration />

      <div className="container mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="text-primary" size={20} /> AI-Powered Tools
            </h2>
            <p className="text-muted-foreground mb-4">
              Harness the power of AI for research, writing, and problem-solving.
            </p>
            <ul className="list-disc list-inside text-sm">
              <li>AI Chatbot for instant answers</li>
              <li>AI-driven content summarization</li>
              <li>Personalized learning recommendations</li>
            </ul>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Library className="text-primary" size={20} /> Vast Knowledge Library
            </h2>
            <p className="text-muted-foreground mb-4">
              Access a curated collection of articles, books, and resources.
            </p>
            <ul className="list-disc list-inside text-sm">
              <li>Curated content across disciplines</li>
              <li>Expert insights and analysis</li>
              <li>Constantly updated resources</li>
            </ul>
          </div>

          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="text-primary" size={20} /> Community Forum
            </h2>
            <p className="text-muted-foreground mb-4">
              Connect with like-minded learners, share ideas, and collaborate.
            </p>
            <ul className="list-disc list-inside text-sm">
              <li>Engage in discussions</li>
              <li>Share your knowledge</li>
              <li>Collaborate on projects</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Why Choose Polymath?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Verified Information</h3>
            <p className="text-sm text-muted-foreground text-center">
              Access reliable and accurate information from trusted sources.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <BookOpen className="text-blue-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Comprehensive Resources</h3>
            <p className="text-sm text-muted-foreground text-center">
              Explore a wide range of topics and resources to expand your knowledge.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Shield className="text-yellow-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your data and privacy are protected with our advanced security measures.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Brain className="text-purple-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-sm text-muted-foreground text-center">
              Leverage AI to personalize your learning experience and achieve your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
