import { useEffect, useRef } from 'react';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';

interface SwipeContainerProps {
  children: React.ReactNode;
}

export default function SwipeContainer({ children }: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { swipeOffset, isSwiping, handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation({
    threshold: 75,
  });

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

  return (
    <div
      ref={containerRef}
      className="transition-transform duration-200 ease-out"
      style={{
        transform: isSwiping ? `translateX(${swipeOffset * 0.3}px)` : 'translateX(0)',
      }}
    >
      {children}
    </div>
  );
}
