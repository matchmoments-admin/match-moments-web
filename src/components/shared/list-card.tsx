'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface ListCardProps {
  title: string;
  category: string;
  categoryHref: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  showName?: string;
  showHref?: string;
  date?: string;
  duration?: string;
  variant?: 'podcast' | 'video' | 'article';
}

export function ListCard({
  title,
  category,
  categoryHref,
  imageUrl,
  imageAlt,
  href,
  showName,
  showHref,
  date,
  duration,
  variant = 'article',
}: ListCardProps) {
  return (
    <article className="group">
      <Link href={href} className="flex items-center gap-4 p-4 rounded-[16px] hover:bg-gray-50 transition-colors duration-150">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-[16px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={categoryHref}
              className="text-sm font-bold text-[#696969] hover:underline transition-all duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {category}
            </Link>
          </div>
          <h3 className="text-base font-medium text-black group-hover:underline transition-all duration-150 mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#696969]">
            {showName && showHref ? (
              <>
                <Link
                  href={showHref}
                  className="hover:underline transition-all duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {showName}
                </Link>
                {date && <span>•</span>}
              </>
            ) : null}
            {date && <span>{date}</span>}
            {duration && (
              <>
                {date && <span>•</span>}
                <span>{duration}</span>
              </>
            )}
          </div>
        </div>

        {/* Play Button */}
        {(variant === 'podcast' || variant === 'video') && (
          <button
            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity duration-150 flex-shrink-0"
            aria-label={`Play ${variant}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle play action
            }}
          >
            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
          </button>
        )}
      </Link>
    </article>
  );
}

