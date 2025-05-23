
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PenSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { UnifiedContentFeed } from "@/components/library/UnifiedContentFeed";
import { ContentSubmissionModal } from "@/components/library/ContentSubmissionModal";
import { PageLayout } from "@/components/layouts/PageLayout";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { ContentType, ContentViewMode } from "@/types/unified-content-types";

const Library = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeContentType, setActiveContentType] = useState<ContentType>(ContentType.All);
  const [activeViewMode, setActiveViewMode] = useState<ContentViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Parse URL parameters to set initial state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    const modeParam = params.get('mode') as ContentViewMode | null;
    const searchParam = params.get('search');
    
    // Set content type based on URL parameter
    if (viewParam) {
      switch (viewParam) {
        case 'media':
          setActiveContentType(ContentType.Media);
          break;
        case 'quotes':
          setActiveContentType(ContentType.Quote);
          break;
        case 'ai':
          setActiveContentType(ContentType.AI);
          break;
        case 'knowledge':
          setActiveContentType(ContentType.Knowledge);
          break;
        case 'forum':
          setActiveContentType(ContentType.Forum);
          break;
        default:
          setActiveContentType(ContentType.All);
      }
    }
    
    // Set view mode based on URL parameter
    if (modeParam && ['grid', 'list', 'feed'].includes(modeParam)) {
      setActiveViewMode(modeParam);
    }
    
    // Set search term based on URL parameter
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeContentType !== ContentType.All) {
      params.set('view', activeContentType);
    }
    
    if (activeViewMode !== 'list') {
      params.set('mode', activeViewMode);
    }
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    const search = params.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;
    
    navigate(newUrl, { replace: true });
  }, [activeContentType, activeViewMode, searchTerm, location.pathname, navigate]);
  
  // Handle search term change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
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
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header with title and create button */}
          <LibraryHeader onCreateEntry={handleCreateContent} />
          
          {/* Search bar */}
          <div className="w-full max-w-md mx-auto">
            <LibrarySearchBar 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
          
          {/* Content feed */}
          <UnifiedContentFeed 
            defaultContentType={activeContentType} 
            defaultViewMode={activeViewMode}
          />
        </div>
        
        {/* Content submission modal */}
        <ContentSubmissionModal
          isOpen={isSubmitModalOpen}
          onOpenChange={setIsSubmitModalOpen}
          defaultTab="knowledge"
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </PageLayout>
  );
};

export default Library;
