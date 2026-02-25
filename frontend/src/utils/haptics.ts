// Haptic feedback utility using the Vibration API
export const haptics = {
  // Light tap feedback
  tap: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  // Success feedback
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  // Error feedback
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  // Selection feedback
  select: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },

  // Check if vibration is supported
  isSupported: () => {
    return 'vibrate' in navigator;
  },
};
