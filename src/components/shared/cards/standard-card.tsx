import Link from 'next/link';
import Image from 'next/image';

export interface StandardCardProps {
  title: string;
  category: string;
  categoryHref?: string;
  author: string;
  readTime: number;
  imageUrl: string;
  href: string;
  date?: string;
}

export function StandardCard({
  title,
  category,
  categoryHref,
  author,
  readTime,
  imageUrl,
  href,
  date,
}: StandardCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-[32px] bg-white">
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <span className="text-category">{category}</span>

          {/* Title */}
          <h2 className="card-title-standard mt-2 group-hover:underline">
            {title}
          </h2>

          {/* Metadata */}
          <div className="text-metadata mt-2">
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

