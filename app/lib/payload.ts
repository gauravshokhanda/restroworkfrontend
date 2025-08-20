// PayloadCMS API integration layer

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000';
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

// Types for PayloadCMS collections
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any; // Rich text content
  heroImage?: {
    id: string;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  categories?: Category[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  meta?: {
    title?: string;
    description?: string;
    image?: {
      url: string;
      alt?: string;
    };
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  hero?: any;
  layout?: any[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  meta?: {
    title?: string;
    description?: string;
    image?: {
      url: string;
      alt?: string;
    };
  };
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  alt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// API response types
export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

export interface PayloadSingleResponse<T> {
  doc: T;
}

// API client class
export class PayloadAPI {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = `${PAYLOAD_API_URL}/api`;
    this.headers = {
      'Content-Type': 'application/json',
    };

    if (PAYLOAD_SECRET) {
      this.headers['Authorization'] = `JWT ${PAYLOAD_SECRET}`;
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PayloadCMS API Error:', error);
      throw error;
    }
  }

  // Posts API methods
  async getPosts(params?: {
    limit?: number;
    page?: number;
    where?: any;
    sort?: string;
  }): Promise<PayloadResponse<Post>> {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.where) searchParams.set('where', JSON.stringify(params.where));

    const query = searchParams.toString();
    return this.request<PayloadResponse<Post>>(`/posts${query ? `?${query}` : ''}`);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const response = await this.request<PayloadResponse<Post>>(
        `/posts?where[slug][equals]=${slug}&limit=1`
      );
      return response.docs[0] || null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      return await this.request<Post>(`/posts/${id}`);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return null;
    }
  }

  // Pages API methods
  async getPages(params?: {
    limit?: number;
    page?: number;
    where?: any;
    sort?: string;
  }): Promise<PayloadResponse<Page>> {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.where) searchParams.set('where', JSON.stringify(params.where));

    const query = searchParams.toString();
    return this.request<PayloadResponse<Page>>(`/pages${query ? `?${query}` : ''}`);
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      const response = await this.request<PayloadResponse<Page>>(
        `/pages?where[slug][equals]=${slug}&limit=1`
      );
      return response.docs[0] || null;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return null;
    }
  }

  // Categories API methods
  async getCategories(): Promise<PayloadResponse<Category>> {
    return this.request<PayloadResponse<Category>>('/categories');
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await this.request<PayloadResponse<Category>>(
        `/categories?where[slug][equals]=${slug}&limit=1`
      );
      return response.docs[0] || null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }

  // Media API methods
  async getMedia(params?: {
    limit?: number;
    page?: number;
    where?: any;
  }): Promise<PayloadResponse<Media>> {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.where) searchParams.set('where', JSON.stringify(params.where));

    const query = searchParams.toString();
    return this.request<PayloadResponse<Media>>(`/media${query ? `?${query}` : ''}`);
  }

  // Contact API methods
  async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'status' | 'priority'>): Promise<Contact> {
    return this.request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        status: 'new',
        priority: 'medium',
      }),
    });
  }

  // Search functionality
  async searchPosts(query: string, limit = 10): Promise<PayloadResponse<Post>> {
    return this.request<PayloadResponse<Post>>(
      `/posts?where[or][0][title][contains]=${encodeURIComponent(query)}&where[or][1][content][contains]=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async searchPages(query: string, limit = 10): Promise<PayloadResponse<Page>> {
    return this.request<PayloadResponse<Page>>(
      `/pages?where[title][contains]=${encodeURIComponent(query)}&limit=${limit}`
    );
  }
}

// Create singleton instance
export const payloadAPI = new PayloadAPI();

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getImageUrl = (media: Media | string): string => {
  if (typeof media === 'string') {
    return media.startsWith('http') ? media : `${PAYLOAD_API_URL}${media}`;
  }
  return media.url.startsWith('http') ? media.url : `${PAYLOAD_API_URL}${media.url}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};