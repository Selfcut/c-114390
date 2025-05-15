
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquare, Quote, Users, Brain, Book, Lightbulb } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-background/90">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Explore Intellectual Frontiers</h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Join our community of scholars, thinkers, and explorers dedicated to preserving and sharing wisdom about consciousness and existence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link to="/auth">Join the Community</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link to="/library">Explore Knowledge</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Discover Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="enhanced-card hover-lift">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 rounded-full bg-primary/20 w-fit">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Knowledge Library</h3>
                <p className="text-muted-foreground">
                  Access our curated collection of texts, articles, and resources on consciousness and ancient wisdom.
                </p>
              </CardContent>
            </Card>
            
            <Card className="enhanced-card hover-lift">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 rounded-full bg-primary/20 w-fit">
                  <MessageSquare size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Forums</h3>
                <p className="text-muted-foreground">
                  Engage in thoughtful discussions with like-minded individuals from around the world.
                </p>
              </CardContent>
            </Card>
            
            <Card className="enhanced-card hover-lift">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 rounded-full bg-primary/20 w-fit">
                  <Quote size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Wisdom Quotes</h3>
                <p className="text-muted-foreground">
                  Discover and contribute to our collection of timeless wisdom from philosophers and thinkers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
              <p className="text-muted-foreground mb-6">
                Connect with scholars, researchers, and curious minds exploring the intersection of science, philosophy, and mysticism.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users size={14} className="text-primary" />
                  </div>
                  <span>Collaborate with like-minded individuals</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Brain size={14} className="text-primary" />
                  </div>
                  <span>Expand your intellectual horizons</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Book size={14} className="text-primary" />
                  </div>
                  <span>Access a wealth of curated knowledge</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Lightbulb size={14} className="text-primary" />
                  </div>
                  <span>Share your insights and discoveries</span>
                </li>
              </ul>
              <Button asChild size="lg">
                <Link to="/auth">Join Now</Link>
              </Button>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg"></div>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join Polymath today and become part of a community dedicated to exploring the depths of human knowledge and wisdom.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img src="/logo.svg" alt="Polymath Logo" className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Polymath</span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground">Help</Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Polymath. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
