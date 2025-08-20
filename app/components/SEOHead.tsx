'use client';

import Head from 'next/head';
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  keywords?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  siteName = 'Your Company Name',
  keywords = []
}) => {
  const defaultTitle = 'Your Company Name';
  const defaultDescription = 'Welcome to our website';
  const defaultImage = '/og-image.jpg'; // You should add a default OG image
  
  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Update document title
  useEffect(() => {
    if (title) {
      document.title = pageTitle;
    }
  }, [pageTitle, title]);

  // Generate structured data for articles
  const generateArticleStructuredData = () => {
    if (type !== 'article') return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: pageDescription,
      image: pageImage,
      url: pageUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        '@type': 'Person',
        name: author || 'Anonymous'
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png`
        }
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    );
  };

  // Generate structured data for website
  const generateWebsiteStructuredData = () => {
    if (type !== 'website') return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      description: pageDescription,
      url: pageUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    );
  };

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title || defaultTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={siteName} />
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {author && <meta property="article:author" content={author} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || defaultTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <meta name="twitter:url" content={pageUrl} />
        {/* Add your Twitter handle if you have one */}
        {/* <meta name="twitter:site" content="@yourtwitterhandle" /> */}
        {/* <meta name="twitter:creator" content="@yourtwitterhandle" /> */}

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      {/* Structured Data */}
      {generateArticleStructuredData()}
      {generateWebsiteStructuredData()}
    </>
  );
};

export default SEOHead;