
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WikiArticle as WikiArticleType } from '@/components/wiki/types';
import { ArrowLeft, Edit, Clock, Eye, BookOpen, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const WikiArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<WikiArticleType | null>(null);
  
  // Load article data
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        // For now, use simulated data
        // In production, this would be a database query
        setTimeout(() => {
          const simulatedArticle: WikiArticleType = {
            id: id || 'default-id',
            title: "Phenomenology and Existentialism",
            content: `# Phenomenology and Existentialism

Phenomenology and existentialism are two philosophical movements that emerged in the early 20th century, primarily in continental Europe. While distinct in many ways, they share important connections and have significantly influenced modern philosophy, psychology, and literature.

## Phenomenology

Phenomenology, founded by Edmund Husserl (1859-1938), is the study of structures of consciousness as experienced from the first-person point of view. The central structure of an experience is its intentionality, being directed toward something, as it is an experience of or about some object.

### Key Concepts in Phenomenology:

- **Intentionality**: All consciousness is consciousness of something
- **Epoché (Bracketing)**: Suspending judgment about the natural world
- **Eidetic Reduction**: Describing the essential structures of experience
- **Lifeworld (Lebenswelt)**: The world as immediately experienced in pre-theoretical attitude

### Major Phenomenologists:

- Edmund Husserl
- Martin Heidegger (who moved phenomenology toward existentialism)
- Maurice Merleau-Ponty
- Max Scheler

## Existentialism

Existentialism is a philosophical movement that emerged in the late 19th and 20th centuries, emphasizing individual existence, freedom, and choice. It holds that humans define their own meaning in life, and try to make rational decisions despite existing in an irrational universe.

### Key Concepts in Existentialism:

- **Existence precedes essence**: Humans have no predetermined nature
- **Authenticity vs. Bad Faith**: Living genuinely vs. self-deception
- **Angst/Anxiety**: The recognition of one's complete freedom
- **Absurdity**: The conflict between human search for meaning and the meaningless universe

### Major Existentialists:

- Søren Kierkegaard (proto-existentialist)
- Friedrich Nietzsche (influential precursor)
- Jean-Paul Sartre
- Simone de Beauvoir
- Albert Camus (associated with absurdism)

## The Connection Between Phenomenology and Existentialism

The connection between phenomenology and existentialism is most evident in the work of Martin Heidegger, who was Husserl's student. Heidegger's phenomenological approach in "Being and Time" (1927) marked a shift toward existential concerns, focusing on the meaning of Being and human existence (Dasein).

Jean-Paul Sartre explicitly brought together existentialism and phenomenology in his work "Being and Nothingness" (1943), using phenomenological methods to analyze human existence and freedom.

Both movements reject abstract theorizing in favor of concrete human experience and emphasize the importance of subjective human perspective.`,
            description: "An exploration of two influential philosophical movements of the 20th century and their connections.",
            category: "Philosophy",
            tags: ["phenomenology", "existentialism", "continental-philosophy", "husserl", "sartre"],
            user_id: "user-123",
            author_name: "PhilosophyProfessor",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            contributors: 3,
            views: 156,
            image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
          };
          
          setArticle(simulatedArticle);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, toast]);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const renderMarkdown = (content: string) => {
    // Very basic markdown rendering for demonstration
    // In production, use a proper markdown library
    const sections = content.split('\n\n');
    return sections.map((section, i) => {
      if (section.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mt-6 mb-4">{section.substring(2)}</h1>;
      } else if (section.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold mt-5 mb-3">{section.substring(3)}</h2>;
      } else if (section.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{section.substring(4)}</h3>;
      } else if (section.startsWith('- ')) {
        const items = section.split('\n').map(item => item.substring(2));
        return (
          <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
            {items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        );
      } else {
        return <p key={i} className="mb-4">{section}</p>;
      }
    });
  };
  
  const handleEditArticle = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to edit articles",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, navigate to edit page or open edit dialog
    toast({
      title: "Edit Mode",
      description: "Article editing functionality would be implemented here",
    });
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/wiki')}
        >
          <ArrowLeft size={16} />
          Back to Wiki
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : article ? (
          <>
            {article.image_url && (
              <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <Badge className="mb-2">{article.category}</Badge>
                  <h1 className="text-3xl font-bold text-white mb-2">{article.title}</h1>
                </div>
              </div>
            )}
            
            {!article.image_url && (
              <div className="mb-6">
                <Badge className="mb-2">{article.category}</Badge>
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              </div>
            )}
            
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_name}`} 
                    alt={article.author_name} 
                  />
                  <AvatarFallback>{article.author_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{article.author_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Published on {formatDate(new Date(article.created_at))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  Updated {formatDate(new Date(article.last_updated))}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {article.views} views
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {article.contributors} contributors
                </span>
              </div>
            </div>
            
            <div className="flex justify-end mb-6">
              <Button 
                onClick={handleEditArticle}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Article
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  {article.content && renderMarkdown(article.content)}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags?.map((tag, i) => (
                <Badge key={i} variant="outline" className="flex items-center gap-1">
                  <Tag size={12} />
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Article not found or has been removed.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/wiki')}
              >
                Back to Wiki
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default WikiArticle;
