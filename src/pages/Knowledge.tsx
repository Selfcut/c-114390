
import React from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';

const Knowledge = () => {
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive knowledge base with articles, guides, and resources.
        </p>
      </div>
    </PageLayout>
  );
};

export default Knowledge;
