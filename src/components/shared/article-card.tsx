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
}: ArticleCardProps) {
  const isFeatured = variant === 'featured';
  const isSmall = variant === 'small';

  return (
    <article className="group cursor-pointer">
      <Link href={href}>
        <div className={`relative overflow-hidden ${isSmall ? 'aspect-square mb-2' : 'aspect-[4/3] mb-4'}`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            sizes={isFeatured ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          />
        </div>
        <div>
          <Link
            href={categoryHref}
            className={`font-bold text-black hover:underline ${isSmall ? 'text-sm' : 'text-2xl'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {category}
          </Link>
          <h2 className={`font-bold text-black mt-2 group-hover:underline ${isFeatured ? 'text-3xl' : isSmall ? 'text-base' : 'text-2xl'}`}>
            {title}
          </h2>
          {description && !isSmall && (
            <p className={`font-light text-black mt-2 ${isFeatured ? 'text-xl' : 'text-base'}`}>
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

