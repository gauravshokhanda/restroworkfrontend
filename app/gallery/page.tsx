'use client';

import React from 'react';
import MediaGallery from '../components/MediaGallery';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Media Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of images, videos, and documents
          </p>
        </div>

        {/* Media Gallery */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <MediaGallery
            limit={24}
            showSearch={true}
            showFilters={true}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;