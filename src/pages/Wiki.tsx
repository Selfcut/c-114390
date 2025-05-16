
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, BookOpen, Plus, ChevronRight, Globe, Brain, Atom, Database, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

interface WikiArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  lastUpdated: string;
  contributors: number;
  views: number;
}

const Wiki = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    category: "",
    content: ""
  });

  // Mock wiki categories
  const categories = [
    { id: "physics", name: "Physics", icon: <Atom size={18} /> },
    { id: "philosophy", name: "Philosophy", icon: <Brain size={18} /> },
    { id: "mathematics", name: "Mathematics", icon: <Database size={18} /> },
    { id: "consciousness", name: "Consciousness", icon: <Lightbulb size={18} /> },
    { id: "systems", name: "Systems Theory", icon: <Globe size={18} /> }
  ];

  // Initial mock wiki articles
  const [articles, setArticles] = useState<WikiArticle[]>([
    {
      id: "1",
      title: "Quantum Mechanics: An Introduction",
      description: "A comprehensive introduction to the fundamental principles of quantum mechanics.",
      category: "physics",
      lastUpdated: "2 days ago",
      contributors: 5,
      views: 423
    },
    {
      id: "2",
      title: "The Hard Problem of Consciousness",
      description: "An exploration of the philosophical challenges in explaining subjective experience.",
      category: "consciousness",
      lastUpdated: "1 week ago",
      contributors: 3,
      views: 287
    },
    {
      id: "3",
      title: "Gödel's Incompleteness Theorems",
      description: "Understanding the limits of formal mathematical systems and their philosophical implications.",
      category: "mathematics",
      lastUpdated: "3 days ago",
      contributors: 2,
      views: 156
    },
    {
      id: "4",
      title: "Feedback Loops in Complex Systems",
      description: "Analyzing positive and negative feedback mechanisms in systems theory.",
      category: "systems",
      lastUpdated: "5 days ago",
      contributors: 4,
      views: 198
    },
    {
      id: "5",
      title: "Mind-Body Problem",
      description: "Historical perspectives and modern approaches to the relationship between mind and matter.",
      category: "philosophy",
      lastUpdated: "2 weeks ago",
      contributors: 7,
      views: 312
    }
  ]);

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery ? 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory ? 
      article.category === selectedCategory
      : true;
      
    return matchesSearch && matchesCategory;
  });

  // Get icon for category
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : <FileText size={18} />;
  };

  const handleCreateArticle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create new wiki articles",
        variant: "destructive"
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleArticleSubmit = () => {
    if (!newArticle.title || !newArticle.description || !newArticle.category || !newArticle.content) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newWikiArticle: WikiArticle = {
        id: `article-${Date.now()}`,
        title: newArticle.title,
        description: newArticle.description,
        category: newArticle.category,
        content: newArticle.content,
        lastUpdated: "Just now",
        contributors: 1,
        views: 0
      };

      setArticles(prevArticles => [newWikiArticle, ...prevArticles]);
      setIsCreateDialogOpen(false);
      setNewArticle({
        title: "",
        description: "",
        category: "",
        content: ""
      });
      setIsSubmitting(false);

      toast({
        title: "Article Created",
        description: "Your new wiki article has been published successfully!",
      });
    }, 1000);
  };

  const loadMoreArticles = () => {
    setIsLoading(true);
    
    // Simulate loading more articles
    setTimeout(() => {
      const additionalArticles: WikiArticle[] = [
        {
          id: `article-${Date.now()}-1`,
          title: "Emergence in Complex Systems",
          description: "How complex behaviors emerge from simple rules and interactions.",
          category: "systems",
          lastUpdated: "1 day ago",
          contributors: 3,
          views: 142
        },
        {
          id: `article-${Date.now()}-2`,
          title: "Quantum Entanglement",
          description: "Understanding the phenomenon of quantum entanglement and its implications.",
          category: "physics",
          lastUpdated: "3 days ago",
          contributors: 4,
          views: 215
        }
      ];

      setArticles(prevArticles => [...prevArticles, ...additionalArticles]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container px-4 lg:px-8 mx-auto py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 stagger-fade animate-in">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen size={28} className="text-primary" />
          Knowledge Wiki
        </h1>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto"
          onClick={handleCreateArticle}
        >
          <Plus size={18} />
          <span>New Article</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1 w-full">
          <Card className="w-full sticky top-20">
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4">Categories</h2>
              <div className="space-y-1">
                <Button
                  variant={!selectedCategory ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  <Globe size={18} className="mr-2" />
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 w-full">
          {/* Search */}
          <div className="mb-6 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search wiki articles..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Articles */}
          {filteredArticles.length > 0 ? (
            <div className="space-y-4 stagger-fade animate-in w-full">
              {filteredArticles.map(article => (
                <Card key={article.id} className="hover:shadow-md transition-shadow w-full flex flex-col">
                  <CardContent className="p-5 flex flex-col">
                    <div className="flex items-start gap-3 w-full">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(article.category)}
                      </div>
                      <div className="flex-1 min-w-0 flex-grow">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-1">
                          <h3 className="font-medium text-lg truncate">{article.title}</h3>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="sm" className="h-8">
                              <ChevronRight size={16} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {article.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div>Last updated: {article.lastUpdated}</div>
                          <div>{article.contributors} contributors</div>
                          <div>{article.views} views</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Load More Button */}
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={loadMoreArticles} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Articles</span>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-8 text-center w-full">
              <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No wiki articles found matching your criteria.</p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Article Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Wiki Article</DialogTitle>
            <DialogDescription>
              Contribute to the community's knowledge base. Add a comprehensive, well-researched article.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="article-title">Title</Label>
                <Input
                  id="article-title"
                  placeholder="Enter a descriptive title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="article-description">Brief Description</Label>
                <Input
                  id="article-description"
                  placeholder="A short summary of this article (1-2 sentences)"
                  value={newArticle.description}
                  onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="article-category">Category</Label>
                <Select 
                  value={newArticle.category} 
                  onValueChange={(value) => setNewArticle({...newArticle, category: value})}
                >
                  <SelectTrigger id="article-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="article-content">Content</Label>
                <Textarea
                  id="article-content"
                  placeholder="Write your article content here..."
                  className="min-h-[300px]"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  You can use Markdown syntax for formatting. *italic* for italic text, **bold** for bold text, etc.
                </p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleArticleSubmit}
              disabled={isSubmitting || !newArticle.title || !newArticle.description || !newArticle.category || !newArticle.content}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <BookOpen size={16} />
                  <span>Publish Article</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wiki;
