import Link from 'next/link';
import { CommentaryEvent } from '@/types/sports';
import { getEventIconComponent, getEventIconClasses } from '@/lib/sport-icons';
import { Flame } from 'lucide-react';

interface MatchTimelineProps {
  events: CommentaryEvent[];
  fixtureId: string;
  currentMomentId?: string;
  gender: 'womens' | 'mens';
  sport: string;
}

export function MatchTimeline({
  events,
  fixtureId,
  currentMomentId,
  gender,
  sport,
}: MatchTimelineProps) {

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const momentUrl = `/${gender}/${sport}/fixtures/${fixtureId}/moments/${event.id}`;
        const isCurrent = event.id === currentMomentId;
        const EventIcon = getEventIconComponent(event.eventType);
        const iconColorClass = getEventIconClasses(event.eventType);

        return (
          <Link
            key={event.id}
            href={momentUrl}
            className={`flex items-start gap-4 rounded-2xl p-4 transition-all ${
              isCurrent
                ? 'bg-black text-white'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Time */}
            <div className="flex flex-col items-center flex-shrink-0 w-16">
              <div className={`text-xl font-bold ${isCurrent ? 'text-white' : 'text-black'}`}>
                {event.eventMinute}'
              </div>
              <div className={`text-xs ${isCurrent ? 'text-white/75' : 'text-gray-500'}`}>
                {event.eventType}
              </div>
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              <EventIcon 
                className={`h-8 w-8 ${isCurrent ? 'text-white' : iconColorClass}`} 
                strokeWidth={1.5}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {event.primaryPlayer && (
                <div className={`font-bold mb-1 ${isCurrent ? 'text-white' : 'text-black'}`}>
                  {event.primaryPlayer.name}
                </div>
              )}
              <div className={`text-sm ${isCurrent ? 'text-white/90' : 'text-gray-700'}`}>
                {event.description}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {isCurrent && (
                <span className="rounded-full bg-white text-black px-3 py-1 text-xs font-bold">
                  Current
                </span>
              )}
              {event.viralScore && event.viralScore >= 70 && (
                <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  isCurrent ? 'bg-white/20' : 'bg-red-100 text-red-800'
                }`}>
                  <Flame className="h-3 w-3" strokeWidth={2} />
                  Trending
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

