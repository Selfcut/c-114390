
import React from 'react';
import { SEO } from '../SEO';
import { ScrollToTop } from '../ui/ScrollToTop';

interface PageSEOProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  hideHeader?: boolean;
  allowGuests?: boolean;
  noIndex?: boolean;
}

export const PageSEO: React.FC<PageSEOProps> = ({
  children,
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  ogType,
  canonicalUrl,
  noIndex = false
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
        canonicalUrl={canonicalUrl}
        noIndex={noIndex}
      />
      {children}
      <ScrollToTop />
    </>
  );
};
