import { useEffect, useRef } from 'react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { Loader2 } from 'lucide-react';

interface PullToRefreshContainerProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

export default function PullToRefreshContainer({ children, onRefresh }: PullToRefreshContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    pullDistance,
    isRefreshing,
    isPulling,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh({ onRefresh, threshold: 80 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const refreshOpacity = Math.min(pullDistance / 80, 1);
  const showRefreshIndicator = isPulling || isRefreshing;

  return (
    <div ref={containerRef} className="relative">
      {showRefreshIndicator && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
          style={{
            height: `${Math.min(pullDistance, 80)}px`,
            opacity: refreshOpacity,
          }}
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Loader2 className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>
        </div>
      )}
      <div
        className="transition-transform duration-200"
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance, 80)}px)` : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
