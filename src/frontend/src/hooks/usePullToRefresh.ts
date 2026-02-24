import { useState, useRef, useCallback } from 'react';

interface PullToRefreshOptions {
  threshold?: number;
  onRefresh: () => Promise<void>;
}

export function usePullToRefresh({ threshold = 80, onRefresh }: PullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const scrollTop = scrollableRef.current?.scrollTop || window.scrollY;
    if (scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const scrollTop = scrollableRef.current?.scrollTop || window.scrollY;
    if (scrollTop !== 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  }, [threshold, isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    setPullDistance(0);
    touchStartY.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    scrollableRef,
  };
}
