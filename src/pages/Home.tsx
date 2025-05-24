
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Library, Book, Youtube, FileText, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MessageSquare,
      title: "Forum Discussions",
      description: "Engage in thoughtful conversations across multiple disciplines",
      link: "/forum"
    },
    {
      icon: Library,
      title: "Knowledge Library",
      description: "Access curated content and learning resources",
      link: "/library"
    },
    {
      icon: Book,
      title: "Collaborative Wiki",
      description: "Build and explore interconnected knowledge",
      link: "/wiki"
    },
    {
      icon: Youtube,
      title: "Media Center",
      description: "Share and discover educational multimedia content",
      link: "/media"
    },
    {
      icon: FileText,
      title: "Wisdom Quotes",
      description: "Collect and share insights from great minds",
      link: "/quotes"
    },
    {
      icon: Users,
      title: "Research Hub",
      description: "Collaborate on research and problem-solving",
      link: "/research"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Polymath
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A platform for interdisciplinary learning, knowledge sharing, and collaborative research across all fields of study.
          </p>
          {!user ? (
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/forum">Explore Forum</Link>
              </Button>
            </div>
          ) : (
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={feature.link}>Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Discussions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Knowledge Articles</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
