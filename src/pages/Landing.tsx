
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Quote, Users, Brain, Lightbulb, ChevronRight, ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const testimonials = [
    {
      text: "Polymath has completely transformed the way I engage with complex topics. The AI recommendations are incredibly accurate!",
      author: "Dr. Sarah Mitchell",
      role: "Professor of Philosophy",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah"
    },
    {
      text: "The community discussions on Polymath have opened my mind to new perspectives I would have never encountered otherwise.",
      author: "Michael Chen",
      role: "Systems Thinker",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Michael"
    },
    {
      text: "I've been able to connect with like-minded intellectuals from across the globe. It's like having a think tank at your fingertips!",
      author: "Amara Okafor",
      role: "Complexity Researcher",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Amara"
    }
  ];

  const features = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Knowledge Network",
      description: "Access a vast interconnected web of ideas, concepts, and theories across multiple disciplines."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Global Community",
      description: "Connect with curious minds from around the world who share your intellectual interests."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Deep Discussions",
      description: "Engage in thoughtful conversations that explore the depths of complex topics."
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "AI Insights",
      description: "Receive personalized recommendations and connections between ideas using our advanced AI."
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive our newsletter with the latest updates."
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              Expanding the frontiers of human knowledge
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Connect Minds, Explore Ideas, Grow Wisdom
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Join our community of scholars, thinkers, and explorers dedicated to preserving and sharing wisdom about consciousness and existence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg group">
                <Link to="/auth">
                  Join the Community
                  <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/library">Explore Knowledge</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Already a member? <Link to="/auth" className="text-primary hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Our Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Polymath brings together the tools and community you need to explore the depths of human knowledge.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-card border rounded-lg p-8 hover:border-primary/30 transition-all hover:shadow-md"
                variants={itemVariants}
              >
                <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                  Growing Community
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Intellectual Collective</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Connect with scholars, researchers, and curious minds exploring the intersection of science, philosophy, and mysticism.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span>Collaborate with like-minded individuals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span>Expand your intellectual horizons</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span>Access a wealth of curated knowledge</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span>Share your insights and discoveries</span>
                  </li>
                </ul>
                <Button asChild size="lg" className="group">
                  <Link to="/auth">
                    Join Now
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <motion.div 
                className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              ></motion.div>
              <motion.div 
                className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              ></motion.div>
              <motion.div 
                className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              ></motion.div>
              <motion.div 
                className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Members Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how Polymath is helping people expand their intellectual horizons.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-lg p-8 mb-8"
            >
              <p className="text-lg mb-6 italic">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].author}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{testimonials[activeTestimonial].author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === activeTestimonial ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Expand Your Knowledge</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our key platform features designed to enhance your intellectual journey.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card border rounded-lg overflow-hidden hover:border-primary/30 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-40 bg-primary/10 flex items-center justify-center">
                <BookOpen size={64} className="text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Knowledge Library</h3>
                <p className="text-muted-foreground mb-4">
                  Access our curated collection of texts, articles, and resources on consciousness and ancient wisdom.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/library">
                    Explore Library
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-card border rounded-lg overflow-hidden hover:border-primary/30 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-40 bg-primary/10 flex items-center justify-center">
                <MessageSquare size={64} className="text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Forum</h3>
                <p className="text-muted-foreground mb-4">
                  Engage in thoughtful discussions with like-minded individuals from around the world.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/forum">
                    Join Discussions
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-card border rounded-lg overflow-hidden hover:border-primary/30 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-40 bg-primary/10 flex items-center justify-center">
                <Quote size={64} className="text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Wisdom Quotes</h3>
                <p className="text-muted-foreground mb-4">
                  Discover and contribute to our collection of timeless wisdom from philosophers and thinkers.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/quotes">
                    Browse Quotes
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              Limited Time Offer
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Polymath today and become part of a community dedicated to exploring the depths of human knowledge and wisdom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-lg">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/pricing">View Premium Plans</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required for free tier. Upgrade anytime.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card border rounded-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with New Knowledge</h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter to receive the latest updates, articles, and intellectual insights.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
            
            <p className="text-xs text-muted-foreground mt-4 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
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
