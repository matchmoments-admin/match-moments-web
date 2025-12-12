import Link from 'next/link';
import Image from 'next/image';

export interface ListCardProps {
  title: string;
  category?: string;
  categoryHref?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  href: string;
}

export function ListCard({
  title,
  category,
  categoryHref,
  author,
  date,
  imageUrl,
  href,
}: ListCardProps) {
  // Text-only variant
  if (!imageUrl) {
    return (
      <article className="group border-b border-gray-200 py-3 last:border-0">
        <Link href={href} className="block text-base font-normal hover:underline">
          {title}
        </Link>
      </article>
    );
  }

  // With thumbnail variant
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl bg-white">
      <Link href={href} className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center">
          {/* Category */}
          {category && (
            <span className="text-category">{category}</span>
          )}

          {/* Title */}
          <h3 className="mt-1 text-xl font-medium group-hover:underline">
            {title}
          </h3>

          {/* Metadata */}
          {(author || date) && (
            <div className="mt-1 text-sm text-muted-foreground">
              {author && <span>By {author}</span>}
              {author && date && <span> • </span>}
              {date && <span>{date}</span>}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

