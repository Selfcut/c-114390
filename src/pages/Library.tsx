
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PenSquare, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ContentTypeFilter, ContentType } from "@/components/library/ContentTypeFilter";
import { ViewSwitcher, ViewMode } from "@/components/library/ViewSwitcher";
import { UnifiedContentFeed } from "@/components/library/UnifiedContentFeed";
import { ContentSubmissionModal } from "@/components/library/ContentSubmissionModal";
import { PageLayout } from "@/components/layouts/PageLayout";

const Library = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeContentType, setActiveContentType] = useState<ContentType>('all');
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<'knowledge' | 'media' | 'quote' | 'ai'>('knowledge');
  
  // Parse URL parameters to set initial state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    const modeParam = params.get('mode') as ViewMode | null;
    
    // Set content type based on URL parameter
    if (viewParam) {
      switch (viewParam) {
        case 'media':
          setActiveContentType('media');
          setActiveTab('media');
          break;
        case 'quotes':
          setActiveContentType('quotes');
          setActiveTab('quote');
          break;
        case 'ai':
          setActiveContentType('ai');
          setActiveTab('ai');
          break;
        case 'knowledge':
          setActiveContentType('knowledge');
          setActiveTab('knowledge');
          break;
        default:
          setActiveContentType('all');
      }
    }
    
    // Set view mode based on URL parameter
    if (modeParam && ['grid', 'list', 'feed'].includes(modeParam)) {
      setActiveViewMode(modeParam as ViewMode);
    }
  }, [location]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeContentType !== 'all') {
      params.set('view', activeContentType);
    }
    
    if (activeViewMode !== 'list') {
      params.set('mode', activeViewMode);
    }
    
    const search = params.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;
    
    navigate(newUrl, { replace: true });
  }, [activeContentType, activeViewMode, location.pathname, navigate]);
  
  // Handle content type change
  const handleContentTypeChange = (type: ContentType) => {
    setActiveContentType(type);
    
    // Set appropriate tab for content submission
    switch (type) {
      case 'media':
        setActiveTab('media');
        break;
      case 'quotes':
        setActiveTab('quote');
        break;
      case 'ai':
        setActiveTab('ai');
        break;
      case 'knowledge':
        setActiveTab('knowledge');
        break;
      default:
        setActiveTab('knowledge');
    }
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setActiveViewMode(mode);
  };
  
  // Handle content creation button click
  const handleCreateContent = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contribute content",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitModalOpen(true);
  };
  
  // Handle successful content submission
  const handleSubmitSuccess = () => {
    toast({
      title: "Content published",
      description: "Your contribution has been published successfully!",
    });
    
    // Refresh the content feed
    // This will happen automatically when the component is unmounted and remounted
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              Knowledge Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover, learn and contribute to our growing library of knowledge
            </p>
          </div>
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
            onClick={handleCreateContent}
          >
            <PenSquare size={18} />
            <span>Contribute</span>
          </Button>
        </div>
        
        <UnifiedContentFeed 
          defaultContentType={activeContentType} 
          defaultViewMode={activeViewMode}
        />
        
        <ContentSubmissionModal
          isOpen={isSubmitModalOpen}
          onOpenChange={setIsSubmitModalOpen}
          defaultTab={activeTab}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </PageLayout>
  );
};

export default Library;
