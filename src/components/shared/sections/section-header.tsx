import Link from 'next/link';
import { ICONS } from '@/lib/sport-icons';
import { iconClass, ICON_TRANSITIONS } from '@/lib/icon-styles';

export interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllText?: string;
  description?: string;
  size?: 'large' | 'medium' | 'small';
}

export function SectionHeader({
  title,
  viewAllHref,
  viewAllText = 'View All',
  description,
  size = 'large',
}: SectionHeaderProps) {
  const sizeClasses = {
    large: 'text-3xl',
    medium: 'text-2xl',
    small: 'text-xl',
  };

  return (
    <div className={`${viewAllHref ? 'mb-8' : 'mb-6'}`}>
      <div className="flex items-center justify-between">
        <h2 className={`font-bold ${sizeClasses[size]}`}>{title}</h2>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-2 text-base font-normal hover:underline"
          >
            {viewAllText}
            <ICONS.chevronRight className={iconClass('arrow', ICON_TRANSITIONS.default)} />
          </Link>
        )}
      </div>

      {description && (
        <p className="text-metadata mt-2">{description}</p>
      )}
    </div>
  );
}

