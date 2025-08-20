'use client';

import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '../lib/payload';

// Types for rich text content
interface RichTextNode {
  type?: string;
  version?: number;
  [key: string]: any;
}

interface RichTextElement {
  children?: RichTextElement[];
  direction?: string;
  format?: string;
  indent?: number;
  type?: string;
  version?: number;
  style?: string;
  mode?: string;
  text?: string;
  tag?: string;
  url?: string;
  newTab?: boolean;
  linkType?: string;
  doc?: any;
  value?: any;
  relationTo?: string;
  fields?: any;
}

interface RichTextProps {
  content: RichTextNode;
  className?: string;
}

const RichTextRenderer: React.FC<RichTextProps> = ({ content, className = '' }) => {
  if (!content || !content.root) {
    return null;
  }

  const renderNode = (node: RichTextElement, index: number): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.text !== undefined) {
      let textElement = <span key={index}>{node.text}</span>;

      // Apply text formatting
      if (node.format) {
        if (node.format.includes('bold')) {
          textElement = <strong key={index}>{textElement}</strong>;
        }
        if (node.format.includes('italic')) {
          textElement = <em key={index}>{textElement}</em>;
        }
        if (node.format.includes('underline')) {
          textElement = <u key={index}>{textElement}</u>;
        }
        if (node.format.includes('strikethrough')) {
          textElement = <s key={index}>{textElement}</s>;
        }
        if (node.format.includes('code')) {
          textElement = (
            <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
              {textElement}
            </code>
          );
        }
      }

      return textElement;
    }

    // Handle different node types
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${node.tag || '2'}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          h1: 'text-4xl font-bold mb-6 mt-8',
          h2: 'text-3xl font-bold mb-5 mt-7',
          h3: 'text-2xl font-bold mb-4 mt-6',
          h4: 'text-xl font-bold mb-3 mt-5',
          h5: 'text-lg font-bold mb-2 mt-4',
          h6: 'text-base font-bold mb-2 mt-3',
        };
        return (
          <HeadingTag key={index} className={headingClasses[HeadingTag as keyof typeof headingClasses]}>
            {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
          </HeadingTag>
        );

      case 'list':
        const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
        const listClass = node.tag === 'ol' ? 'list-decimal' : 'list-disc';
        return (
          <ListTag key={index} className={`${listClass} ml-6 mb-4 space-y-2`}>
            {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
          </ListTag>
        );

      case 'listitem':
        return (
          <li key={index} className="leading-relaxed">
            {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
          </li>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic bg-gray-50 rounded-r">
            {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
          </blockquote>
        );

      case 'link':
        const isExternal = node.linkType === 'custom' || (node.url && node.url.startsWith('http'));
        const linkProps = {
          href: node.url || '#',
          className: 'text-blue-600 hover:text-blue-800 underline transition-colors',
          ...(isExternal && node.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        };
        return (
          <a key={index} {...linkProps}>
            {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
          </a>
        );

      case 'linebreak':
        return <br key={index} />;

      case 'horizontalrule':
        return <hr key={index} className="my-8 border-gray-300" />;

      case 'code':
        return (
          <pre key={index} className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm">
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </code>
          </pre>
        );

      // Handle PayloadCMS blocks
      case 'block':
        return renderBlock(node, index);

      default:
        // Handle unknown elements by rendering their children
        if (node.children) {
          return (
            <div key={index}>
              {node.children.map((child, childIndex) => renderNode(child, childIndex))}
            </div>
          );
        }
        return null;
    }
  };

  const renderBlock = (block: RichTextElement, index: number): React.ReactNode => {
    if (!block.fields) return null;

    switch (block.fields.blockType) {
      case 'mediaBlock':
        const media = block.fields.media;
        if (!media) return null;

        return (
          <div key={index} className="my-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(media)}
                alt={media.alt || 'Media'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
            {block.fields.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {block.fields.caption}
              </p>
            )}
          </div>
        );

      case 'banner':
        const bannerStyle = block.fields.style || 'info';
        const bannerStyles = {
          info: 'bg-blue-50 border-blue-200 text-blue-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          success: 'bg-green-50 border-green-200 text-green-800',
        };

        return (
          <div key={index} className={`border-l-4 p-4 mb-6 rounded-r ${bannerStyles[bannerStyle as keyof typeof bannerStyles] || bannerStyles.info}`}>
            <div className="font-medium mb-2">{block.fields.content}</div>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="my-6">
            <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{block.fields.code}</code>
            </pre>
            {block.fields.language && (
              <p className="text-xs text-gray-500 mt-1">Language: {block.fields.language}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content.root.children?.map((node, index) => renderNode(node, index))}
    </div>
  );
};

export default RichTextRenderer;