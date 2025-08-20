'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { payloadAPI, Page } from '../lib/payload';
import DynamicPageRenderer from '../components/DynamicPageRenderer';
import SEOHead from '../components/SEOHead';

const DynamicPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPage = await payloadAPI.getPageBySlug(slug);
        
        if (!fetchedPage) {
          setError('Page not found');
          return;
        }

        setPage(fetchedPage);
      } catch (err) {
        setError('Failed to load page. Please try again later.');
        console.error('Error fetching page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-red-800 mb-4">
                {error === 'Page not found' ? 'Page Not Found' : 'Error Loading Page'}
              </h1>
              <p className="text-red-600 mb-6">
                {error === 'Page not found'
                  ? 'The page you\'re looking for doesn\'t exist or has been moved.'
                  : error}
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => router.back()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={page.meta?.title || page.title}
        description={page.meta?.description}
        image={page.meta?.image?.url}
        url={`${window.location.origin}/${page.slug}`}
      />
      <DynamicPageRenderer page={page} />
    </>
  );
};

export default DynamicPage;