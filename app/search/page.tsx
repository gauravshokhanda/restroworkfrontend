'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { payloadAPI, Post, Page, formatDate, getImageUrl, truncateText } from '../lib/payload';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'pages'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPosts([]);
      setPages([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const [postsResponse, pagesResponse] = await Promise.all([
        payloadAPI.searchPosts(searchQuery, 10),
        payloadAPI.searchPages(searchQuery, 10)
      ]);

      setPosts(postsResponse.docs);
      setPages(pagesResponse.docs);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams?.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set('q', query.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url.toString());
  };

  const extractTextFromContent = (content: any): string => {
    if (!content || !content.root || !content.root.children) return '';
    
    const extractText = (nodes: any[]): string => {
      return nodes.map(node => {
        if (node.text) return node.text;
        if (node.children) return extractText(node.children);
        return '';
      }).join(' ');
    };
    
    return extractText(content.root.children);
  };

  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const totalResults = posts.length + pages.length;
  const filteredPosts = activeTab === 'pages' ? [] : posts;
  const filteredPages = activeTab === 'posts' ? [] : pages;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search</h1>
          <p className="text-xl text-gray-600">
            Find posts, pages, and content across our site
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && hasSearched && (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                {totalResults === 0 ? (
                  <>No results found for <strong>"{query}"</strong></>
                ) : (
                  <>Found <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for <strong>"{query}"</strong></>
                )}
              </p>
            </div>

            {totalResults > 0 && (
              <>
                {/* Filter Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab('all')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'all'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        All ({totalResults})
                      </button>
                      <button
                        onClick={() => setActiveTab('posts')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'posts'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Posts ({posts.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('pages')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'pages'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Pages ({pages.length})
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Results List */}
                <div className="space-y-6">
                  {/* Posts Results */}
                  {filteredPosts.map((post) => {
                    const excerpt = extractTextFromContent(post.content);
                    
                    return (
                      <article key={`post-${post.id}`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          {post.heroImage && (
                            <div className="flex-shrink-0">
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                <Image
                                  src={getImageUrl(post.heroImage)}
                                  alt={post.heroImage.alt || post.title}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Post
                              </span>
                              <time className="text-sm text-gray-500">
                                {formatDate(post.createdAt)}
                              </time>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {highlightText(post.title, query)}
                              </Link>
                            </h3>
                            {excerpt && (
                              <p className="text-gray-600 line-clamp-2">
                                {highlightText(truncateText(excerpt, 200), query)}
                              </p>
                            )}
                            {post.categories && post.categories.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {post.categories.slice(0, 3).map((category) => (
                                  <span
                                    key={category.id}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {category.title}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {/* Pages Results */}
                  {filteredPages.map((page) => (
                    <article key={`page-${page.id}`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Page
                            </span>
                            <time className="text-sm text-gray-500">
                              {formatDate(page.createdAt)}
                            </time>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            <Link
                              href={`/${page.slug}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {highlightText(page.title, query)}
                            </Link>
                          </h3>
                          {page.meta?.description && (
                            <p className="text-gray-600 line-clamp-2">
                              {highlightText(page.meta.description, query)}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* No Results */}
            {totalResults === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find anything matching your search. Try:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Checking your spelling</li>
                    <li>• Using different keywords</li>
                    <li>• Using more general terms</li>
                    <li>• Browsing our <Link href="/blog" className="text-blue-600 hover:underline">blog</Link> or <Link href="/" className="text-blue-600 hover:underline">homepage</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your search</h3>
              <p className="text-gray-600">
                Enter a search term above to find posts, pages, and content across our site.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;