'use client';

import { useEffect, useState } from 'react';
import { Danmaku } from '@/types';

const MAX_LINES = 15; // 最多显示15行

export default function DisplayPage() {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [displayDanmakus, setDisplayDanmakus] = useState<Danmaku[]>([]);

  useEffect(() => {
    fetchDanmakus();
    // 每2秒检查新弹幕
    const interval = setInterval(fetchDanmakus, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchDanmakus = async () => {
    try {
      const response = await fetch('/api/danmaku/censored');
      const data = await response.json();
      
      if (data.danmakus && Array.isArray(data.danmakus)) {
        // 检查是否有新弹幕
        const newDanmakus = data.danmakus;
        setDanmakus(newDanmakus);
        
        // 更新显示的弹幕（保持最新的15条）
        setDisplayDanmakus((prev) => {
          const allIds = prev.map((d) => d.id);
          const hasNewDanmaku = newDanmakus.some((d: Danmaku) => !allIds.includes(d.id));
          
          if (hasNewDanmaku || prev.length === 0) {
            // 取最新的15条
            const latest = newDanmakus.slice(-MAX_LINES);
            return latest;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('获取弹幕失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-end p-8">
      <div className="space-y-2">
        {displayDanmakus.map((danmaku, index) => (
          <div
            key={danmaku.id}
            className="text-4xl font-medium animate-slideIn"
            style={{
              animationDelay: `${index * 0.05}s`,
              lineHeight: '1.5',
            }}
          >
            {danmaku.content}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
