
import React from 'react';
import { SEO } from '../SEO';
import { PageLayout } from './PageLayout';

interface PageSEOProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  hideHeader?: boolean;
  allowGuests?: boolean;
}

export const PageSEO: React.FC<PageSEOProps> = ({
  children,
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  ogType,
  hideHeader = false,
  allowGuests = false
}) => {
  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogUrl={ogUrl}
        ogType={ogType}
      />
      <PageLayout hideHeader={hideHeader} allowGuests={allowGuests}>
        {children}
      </PageLayout>
    </>
  );
};
