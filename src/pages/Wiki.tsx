
import React, { useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, BookOpen, Plus, ChevronRight, Globe, Brain, Atom, Database, Lightbulb } from "lucide-react";

const Wiki = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock wiki categories
  const categories = [
    { id: "physics", name: "Physics", icon: <Atom size={18} /> },
    { id: "philosophy", name: "Philosophy", icon: <Brain size={18} /> },
    { id: "mathematics", name: "Mathematics", icon: <Database size={18} /> },
    { id: "consciousness", name: "Consciousness", icon: <Lightbulb size={18} /> },
    { id: "systems", name: "Systems Theory", icon: <Globe size={18} /> }
  ];

  // Mock wiki articles
  const articles = [
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
  ];

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

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen size={28} className="text-primary" />
            Knowledge Wiki
          </h1>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            <span>New Article</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <Card>
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
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search wiki articles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Articles */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-4 stagger-fade animate-in">
                {filteredArticles.map(article => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(article.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-4 mb-1">
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
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No wiki articles found matching your criteria.</p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Wiki;
