/**
 * Sport Icon Component
 * Renders sport-specific icons from react-icons
 */

import type { ComponentProps } from 'react';
import type { SportType } from '@/types/sports';
import { getSportIconComponent } from '@/lib/sport-icons';

interface SportIconProps extends Omit<ComponentProps<'svg'>, 'ref'> {
  sport: SportType;
}

export function SportIcon({ sport, className, ...props }: SportIconProps) {
  const IconComponent = getSportIconComponent(sport);
  
  return <IconComponent className={className} {...props} />;
}

