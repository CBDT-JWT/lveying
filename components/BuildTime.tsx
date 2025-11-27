'use client';

import { useEffect, useState } from 'react';

export default function BuildTime() {
  const [buildTime, setBuildTime] = useState('');

  useEffect(() => {
    // Get build time from environment or generate current time
    const time = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '.').replace(',', '');
    
    setBuildTime(time);
  }, []);

  if (!buildTime) return null;

  return (
    <span className="text-xs">
      Last Build: {buildTime}
    </span>
  );
}
