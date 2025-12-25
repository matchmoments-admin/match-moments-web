import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'list' | 'table' | 'text';
  count?: number;
}

export function LoadingSkeleton({ 
  className, 
  variant = 'card',
  count = 3 
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
              <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
              <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4">
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 py-3">
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-2/6"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function MatchCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border p-4 space-y-3">
      <div className="h-3 bg-muted rounded w-1/3"></div>
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-muted rounded-full"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        <div className="h-8 w-16 bg-muted rounded"></div>
        <div className="flex items-center gap-2 justify-end">
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-6 w-6 bg-muted rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-muted rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border overflow-hidden">
      <div className="h-48 bg-muted"></div>
      <div className="p-6 space-y-3">
        <div className="h-6 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-3 bg-muted rounded w-1/3"></div>
      </div>
    </div>
  );
}

