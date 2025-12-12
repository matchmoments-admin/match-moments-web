import Link from 'next/link';
import Image from 'next/image';

export interface FeaturedCardProps {
  title: string;
  category: string;
  categoryHref?: string;
  author: string;
  readTime: number;
  imageUrl: string;
  href: string;
  date?: string;
}

export function FeaturedCard({
  title,
  category,
  categoryHref,
  author,
  readTime,
  imageUrl,
  href,
  date,
}: FeaturedCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-[32px] bg-white">
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-opacity duration-150 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <span className="text-sm font-bold text-[#6B7280]">{category}</span>

          {/* Title */}
          <h3 className="mt-2 text-[28px] font-bold leading-[33.6px] tracking-[-0.516056px] group-hover:underline">
            {title}
          </h3>

          {/* Metadata */}
          <div className="mt-2 text-base font-normal text-[#6B7280]">
            <span>By {author}</span>
            {date && (
              <>
                <span> • </span>
                <span>{date}</span>
              </>
            )}
            <span> • </span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

