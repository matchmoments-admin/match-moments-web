import Image from 'next/image';
import Link from 'next/link';

export interface ArticleHeroProps {
  title: string;
  category: string;
  categoryHref: string;
  author: string;
  date: string;
  readTime: number;
  imageUrl: string;
  categoryBadgeColor?: string;
}

export function ArticleHero({
  title,
  category,
  categoryHref,
  author,
  date,
  readTime,
  imageUrl,
  categoryBadgeColor = 'bg-gray-800',
}: ArticleHeroProps) {
  return (
    <div className="relative h-[400px] w-full md:h-[600px]">
      {/* Hero Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 md:p-8 md:pb-12">
        <div className="mx-auto max-w-[800px]">
          {/* Category Badge */}
          <Link href={categoryHref}>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-80 md:text-sm ${categoryBadgeColor}`}
            >
              {category}
            </span>
          </Link>

          {/* Title */}
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white md:mt-4 md:text-[56px] md:leading-[56px] md:tracking-[-1.41634px]">
            {title}
          </h1>

          {/* Metadata */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-normal text-white/90 md:mt-4 md:text-base">
            <span>By {author}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}

