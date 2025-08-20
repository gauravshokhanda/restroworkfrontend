'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Page, getImageUrl } from '../lib/payload';
import RichTextRenderer from './RichTextRenderer';
import ContactForm from './ContactForm';

interface DynamicPageRendererProps {
  page: Page;
}

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ page }) => {
  const renderHero = (hero: any) => {
    if (!hero) return null;

    return (
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {hero.eyebrow && (
                <p className="text-blue-200 font-medium mb-4">{hero.eyebrow}</p>
              )}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {hero.headline}
              </h1>
              {hero.description && (
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  {hero.description}
                </p>
              )}
              {hero.links && hero.links.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {hero.links.map((link: any, index: number) => {
                    const isPrimary = link.appearance === 'primary';
                    return (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          isPrimary
                            ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                            : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                        }`}
                        {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {link.label}
                        {link.newTab && (
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {hero.media && (
              <div className="relative">
                <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getImageUrl(hero.media)}
                    alt={hero.media.alt || 'Hero image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderLayoutBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'content':
        return (
          <section key={index} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                {block.columnOne && (
                  <RichTextRenderer content={block.columnOne} className="prose-lg" />
                )}
              </div>
              {block.columnTwo && (
                <div className="mt-8">
                  <RichTextRenderer content={block.columnTwo} className="prose-lg" />
                </div>
              )}
            </div>
          </section>
        );

      case 'mediaBlock':
        return (
          <section key={index} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={block.position === 'right' ? 'lg:order-2' : ''}>
                  {block.media && (
                    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={getImageUrl(block.media)}
                        alt={block.media.alt || 'Media block image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>
                <div className={block.position === 'right' ? 'lg:order-1' : ''}>
                  {block.content && (
                    <RichTextRenderer content={block.content} className="prose-lg" />
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'callToAction':
        return (
          <section key={index} className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {block.content && (
                <div className="text-white mb-8">
                  <RichTextRenderer content={block.content} className="prose-lg prose-invert" />
                </div>
              )}
              {block.links && block.links.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {block.links.map((link: any, linkIndex: number) => {
                    const isPrimary = link.appearance === 'primary';
                    return (
                      <Link
                        key={linkIndex}
                        href={link.url || '#'}
                        className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          isPrimary
                            ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                            : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                        }`}
                        {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {link.label}
                        {link.newTab && (
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );

      case 'archive':
        return (
          <section key={index} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                {block.introContent && (
                  <RichTextRenderer content={block.introContent} className="prose-lg" />
                )}
              </div>
              <div className="text-center">
                <Link
                  href={`/${block.relationTo || 'posts'}`}
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View All {block.relationTo === 'posts' ? 'Posts' : 'Items'}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        );

      case 'formBlock':
        return (
          <section key={index} className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {block.form && (
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {block.form.title || 'Contact Us'}
                    </h2>
                    {block.form.description && (
                      <p className="text-gray-600">{block.form.description}</p>
                    )}
                  </div>
                )}
                <ContactForm />
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Render Hero Section */}
      {page.hero && renderHero(page.hero)}

      {/* Render Layout Blocks */}
      {page.layout && page.layout.length > 0 && (
        <>
          {page.layout.map((block, index) => renderLayoutBlock(block, index))}
        </>
      )}

      {/* Fallback Content if no layout blocks */}
      {(!page.layout || page.layout.length === 0) && !page.hero && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
              <p className="text-gray-600">
                This page is managed by the CMS but doesn't have any content blocks configured yet.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DynamicPageRenderer;