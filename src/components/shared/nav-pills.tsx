'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavPill {
  label: string;
  href: string;
}

interface NavPillsProps {
  pills: NavPill[];
}

export function NavPills({ pills }: NavPillsProps) {
  const pathname = usePathname();

  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <nav
        className="flex items-center gap-2 px-8 py-4 max-w-[1920px] mx-auto"
        aria-label="Category navigation"
      >
        {pills.map((pill) => {
          const isActive = pathname === pill.href || pathname?.startsWith(pill.href);
          return (
            <Link
              key={pill.href}
              href={pill.href}
              className={`
                whitespace-nowrap px-4 py-2 rounded-[20px] text-base font-normal transition-all duration-150
                ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-[#F5F5F6] text-black hover:bg-gray-200'
                }
              `}
            >
              {pill.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

