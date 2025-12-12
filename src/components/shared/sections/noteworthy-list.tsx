import Link from 'next/link';

export interface NoteworthyItem {
  id: string;
  title: string;
  href: string;
}

export interface NoteworthyListProps {
  title?: string;
  items: NoteworthyItem[];
  showDividers?: boolean;
  backgroundColor?: string;
}

export function NoteworthyList({
  title = 'Noteworthy Reads',
  items,
  showDividers = false,
  backgroundColor = 'bg-gray-50',
}: NoteworthyListProps) {
  if (showDividers) {
    return (
      <div>
        {title && <h3 className="mb-6 text-2xl font-bold">{title}</h3>}
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="py-3">
              <Link
                href={item.href}
                className="text-base font-normal hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl ${backgroundColor} p-6`}>
      {title && <h3 className="mb-4 text-xl font-bold">{title}</h3>}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="text-base font-normal hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

