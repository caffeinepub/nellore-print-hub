interface SkeletonCardProps {
  variant?: 'project' | 'review' | 'service' | 'quotation';
}

export default function SkeletonCard({ variant = 'project' }: SkeletonCardProps) {
  if (variant === 'project') {
    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border animate-pulse">
        <div className="w-full h-48 bg-muted shimmer" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-muted rounded shimmer w-3/4" />
          <div className="h-4 bg-muted rounded shimmer w-full" />
          <div className="h-4 bg-muted rounded shimmer w-2/3" />
        </div>
      </div>
    );
  }

  if (variant === 'review') {
    return (
      <div className="bg-card rounded-lg p-6 border border-border animate-pulse">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-muted shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded shimmer w-1/3" />
            <div className="h-4 bg-muted rounded shimmer w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded shimmer w-full" />
          <div className="h-4 bg-muted rounded shimmer w-5/6" />
          <div className="h-4 bg-muted rounded shimmer w-4/6" />
        </div>
      </div>
    );
  }

  if (variant === 'quotation') {
    return (
      <div className="bg-card rounded-lg p-6 border border-border animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded shimmer w-1/2" />
            <div className="h-4 bg-muted rounded shimmer w-1/3" />
          </div>
          <div className="h-6 w-20 bg-muted rounded-full shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded shimmer w-full" />
          <div className="h-4 bg-muted rounded shimmer w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border animate-pulse">
      <div className="space-y-3">
        <div className="h-6 bg-muted rounded shimmer w-1/2" />
        <div className="h-4 bg-muted rounded shimmer w-full" />
        <div className="h-4 bg-muted rounded shimmer w-5/6" />
      </div>
    </div>
  );
}
