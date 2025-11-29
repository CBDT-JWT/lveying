'use client';

import GuestNavBar from '@/components/GuestNavBar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useEffect, useState } from 'react';
import BuildTime from '@/components/BuildTime';

export default function CreditsPage() {
  const [creditsContent, setCreditsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const response = await fetch('/credits.md');
        const text = await response.text();
        setCreditsContent(text);
      } catch (error) {
        console.error('加载演职人员名单失败:', error);
        setCreditsContent('# 演职人员名单\n\n加载失败，请刷新页面重试。');
      } finally {
        setLoading(false);
      }
    };

    loadCredits();
  }, []);

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/guestbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* 导航栏 */}
      <GuestNavBar />

      <div className="max-w-5xl mx-auto px-4 pt-20">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 drop-shadow-lg mb-6 text-center">
            工作人员表
          </h1>

          <div className="w-full">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-600 drop-shadow-lg">加载中...</div>
              </div>
            ) : (
              <div className="max-w-none">
                <MarkdownRenderer content={creditsContent} formatNames={true} />
              </div>
            )}
          </div>
        </div>
        
        {/* 制作信息 */}
        <div className="text-center mt-4 pb-4">
          <p className="text-sm text-gray-800 drop-shadow-md">
            © 2025 <a href="https://www.jiangwt.org" target="_blank" rel="noopener noreferrer" className="hover:underline">江玮陶</a>
            {' | '}
            <a href="https://github.com/CBDT-JWT/lveying" target="_blank" rel="noopener noreferrer" className="hover:underline">Github</a>
            {' | '}
            <span className="text-xs">
              <BuildTime />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}