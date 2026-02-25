import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

interface SwipeNavigationOptions {
  threshold?: number;
  preventScroll?: boolean;
}

export function useSwipeNavigation(options: SwipeNavigationOptions = {}) {
  const { threshold = 50, preventScroll = false } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const currentX = useRef(0);

  // Define page order for swipe navigation
  const pageOrder = ['/', '/services', '/gallery', '/testimonials'];

  const getCurrentIndex = () => {
    return pageOrder.indexOf(location.pathname);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartX.current) return;

    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      setSwipeOffset(deltaX);

      if (preventScroll) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) {
      setSwipeOffset(0);
      return;
    }

    const currentIndex = getCurrentIndex();
    if (currentIndex === -1) {
      setSwipeOffset(0);
      setIsSwiping(false);
      return;
    }

    // Swipe right (go to previous page)
    if (swipeOffset > threshold && currentIndex > 0) {
      navigate({ to: pageOrder[currentIndex - 1] });
    }
    // Swipe left (go to next page)
    else if (swipeOffset < -threshold && currentIndex < pageOrder.length - 1) {
      navigate({ to: pageOrder[currentIndex + 1] });
    }

    setSwipeOffset(0);
    setIsSwiping(false);
    touchStartX.current = 0;
    touchStartY.current = 0;
  };

  return {
    swipeOffset,
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
