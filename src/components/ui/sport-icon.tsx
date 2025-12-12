/**
 * Sport Icon Component
 * Renders SIDEARM-style sport-specific SVG icons
 */

import type { SVGProps } from 'react';
import type { SportType } from '@/types/sports';
import { getSportIconData } from '@/lib/sport-icons';

interface SportIconProps extends SVGProps<SVGSVGElement> {
  sport: SportType;
}

export function SportIcon({ sport, ...props }: SportIconProps) {
  const iconData = getSportIconData(sport);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconData.viewBox}
      fill="currentColor"
      {...props}
    >
      {iconData.paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}

