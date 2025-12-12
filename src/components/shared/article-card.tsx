'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  description?: string;
  category: string;
  categoryHref: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  variant?: 'featured' | 'standard' | 'small';
  author?: string;
  readTime?: string;
  date?: string;
}

export function ArticleCard({
  title,
  description,
  category,
  categoryHref,
  imageUrl,
  imageAlt,
  href,
  variant = 'standard',
  author,
  readTime,
  date,
}: ArticleCardProps) {
  const isFeatured = variant === 'featured';
  const isSmall = variant === 'small';

  return (
    <article className="group cursor-pointer rounded-[32px] overflow-hidden">
      <Link href={href}>
        <div className={`relative overflow-hidden ${isSmall ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-opacity duration-150 ease-in-out group-hover:opacity-90"
            sizes={isFeatured ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          />
        </div>
        <div className="p-6">
          <Link
            href={categoryHref}
            className="text-sm font-bold text-[#696969] hover:underline transition-all duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {category}
          </Link>
          {isFeatured ? (
            <h3 className="text-[28px] font-bold leading-[33.6px] tracking-[-0.516056px] mt-2 group-hover:underline transition-all duration-150">
              {title}
            </h3>
          ) : (
            <h2 className={`font-medium text-black mt-2 group-hover:underline transition-all duration-150 ${
              isSmall ? 'text-base leading-6' : 'text-2xl leading-[28.8px] tracking-[-0.621127px]'
            }`}>
              {title}
            </h2>
          )}
          {(author || readTime || date) && (
            <div className="text-base font-normal text-[#696969] mt-2">
              {author && <span>By {author}</span>}
              {date && <span> • {date}</span>}
              {readTime && <span> • {readTime} min read</span>}
            </div>
          )}
          {description && !isSmall && (
            <p className="text-base font-normal text-[#696969] mt-2">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

