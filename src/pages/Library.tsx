
import React, { useState, useCallback } from 'react';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { LibrarySearchBar } from '@/components/library/LibrarySearchBar';
import { ContentFeedControls } from '@/components/library/ContentFeedControls';
import { ContentFeed } from '@/components/library/ContentFeed';
import { ContentViewMode, ContentType } from '@/types/unified-content-types';
import { QuoteSubmissionModal } from '@/components/QuoteSubmissionModal';

const Library = () => {
  const [contentType, setContentType] = useState<ContentType>(ContentType.All);
  const [viewMode, setViewMode] = useState<ContentViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date>();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  const handleCreateEntry = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleContentCreated = useCallback(() => {
    setShowCreateModal(false);
    handleRefresh();
  }, [handleRefresh]);

  const handleContentTypeChange = useCallback((type: string) => {
    setContentType(type as ContentType);
  }, []);

  const handleViewModeChange = useCallback((mode: ContentViewMode) => {
    setViewMode(mode);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <LibraryHeader onCreateEntry={handleCreateEntry} />
      
      <div className="my-6">
        <LibrarySearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Search content..."
        />
      </div>

      <div className="mb-6">
        <ContentFeedControls
          contentType={contentType}
          viewMode={viewMode}
          onContentTypeChange={handleContentTypeChange}
          onViewModeChange={handleViewModeChange}
          onRefresh={handleRefresh}
        />
      </div>

      <ContentFeed
        contentType={contentType}
        viewMode={viewMode}
        lastRefresh={lastRefresh}
      />

      <QuoteSubmissionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onQuoteAdded={handleContentCreated}
      />
    </div>
  );
};

export default Library;
