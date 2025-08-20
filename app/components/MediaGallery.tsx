'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { payloadAPI, Media, getImageUrl } from '../lib/payload';

interface MediaGalleryProps {
  limit?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
  onMediaSelect?: (media: Media) => void;
  selectedMedia?: Media[];
  allowMultiple?: boolean;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  limit = 12,
  showSearch = true,
  showFilters = true,
  className = '',
  onMediaSelect,
  selectedMedia = [],
  allowMultiple = false
}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Media[]>(selectedMedia);

  // Media type filters
  const mediaTypes = [
    { value: 'all', label: 'All Media' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Documents' }
  ];

  const getMediaTypeFromMime = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      let whereClause: any = {};

      // Add search filter
      if (searchQuery) {
        whereClause['or'] = [
          {
            filename: {
              contains: searchQuery
            }
          },
          {
            alt: {
              contains: searchQuery
            }
          }
        ];
      }

      // Add type filter
      if (filterType !== 'all') {
        const mimeTypePatterns = {
          image: 'image/',
          video: 'video/',
          audio: 'audio/',
          document: ''
        };
        
        const pattern = mimeTypePatterns[filterType as keyof typeof mimeTypePatterns];
        if (pattern) {
          whereClause['mimeType'] = {
            like: `${pattern}%`
          };
        } else if (filterType === 'document') {
          whereClause['and'] = [
            {
              mimeType: {
                not_like: 'image/%'
              }
            },
            {
              mimeType: {
                not_like: 'video/%'
              }
            },
            {
              mimeType: {
                not_like: 'audio/%'
              }
            }
          ];
        }
      }

      const response = await payloadAPI.getMedia({
        limit,
        page: currentPage,
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined
      });

      setMedia(response.docs);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch media. Please try again later.');
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [currentPage, searchQuery, filterType, limit]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, filterType]);

  const handleMediaClick = (mediaItem: Media) => {
    if (!onMediaSelect) return;

    if (allowMultiple) {
      const isSelected = selectedItems.some(item => item.id === mediaItem.id);
      let newSelection: Media[];
      
      if (isSelected) {
        newSelection = selectedItems.filter(item => item.id !== mediaItem.id);
      } else {
        newSelection = [...selectedItems, mediaItem];
      }
      
      setSelectedItems(newSelection);
      onMediaSelect(mediaItem);
    } else {
      setSelectedItems([mediaItem]);
      onMediaSelect(mediaItem);
    }
  };

  const isMediaSelected = (mediaItem: Media): boolean => {
    return selectedItems.some(item => item.id === mediaItem.id);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMediaItem = (mediaItem: Media) => {
    const mediaType = getMediaTypeFromMime(mediaItem.mimeType);
    const isSelected = isMediaSelected(mediaItem);

    return (
      <div
        key={mediaItem.id}
        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
          isSelected
            ? 'border-blue-500 ring-2 ring-blue-200'
            : 'border-gray-200 hover:border-gray-300'
        } ${onMediaSelect ? 'hover:shadow-lg' : ''}`}
        onClick={() => handleMediaClick(mediaItem)}
      >
        <div className="aspect-square relative bg-gray-100">
          {mediaType === 'image' ? (
            <Image
              src={getImageUrl(mediaItem)}
              alt={mediaItem.alt || mediaItem.filename}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                {mediaType === 'video' && (
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {mediaType === 'audio' && (
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
                {mediaType === 'document' && (
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <p className="text-xs text-gray-500 font-medium">
                  {mediaItem.filename.split('.').pop()?.toUpperCase()}
                </p>
              </div>
            </div>
          )}
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Media info */}
        <div className="p-3">
          <p className="text-sm font-medium text-gray-900 truncate" title={mediaItem.filename}>
            {mediaItem.filename}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">
              {formatFileSize(mediaItem.filesize)}
            </span>
            {mediaItem.width && mediaItem.height && (
              <span className="text-xs text-gray-500">
                {mediaItem.width} × {mediaItem.height}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Media</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchMedia}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {showFilters && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {mediaTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading media...</p>
        </div>
      )}

      {/* Media Grid */}
      {!loading && (
        <>
          {media.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No media found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No media files have been uploaded yet.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.map(renderMediaItem)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediaGallery;