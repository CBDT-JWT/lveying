'use client';

import { useEffect } from 'react';

export default function TitleManager() {
  useEffect(() => {
    const originalTitle = document.title;
    const hiddenTitle = '「不要掠过那个瞬间」';

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = hiddenTitle;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
