'use client';

import { useEffect } from 'react';

interface ScrollToTopProps {
  triggerKey?: string;
}

export function ScrollToTop({ triggerKey }: ScrollToTopProps) {
  useEffect(() => {
    // Scroll cleanly to the very top smoothly without layout jumping
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [triggerKey]);

  return null;
}
