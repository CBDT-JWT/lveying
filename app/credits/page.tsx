'use client';

import GuestNavBar from '@/components/GuestNavBar';
import Image from 'next/image';

export default function CreditsPage() {
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

      <div className="max-w-4xl mx-auto px-4 pt-20">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 drop-shadow-lg mb-6 text-center">
            演职人员表
          </h1>

          <div className="w-full">
            <Image
              src="/credits.jpg"
              alt="演职人员表"
              width={1200}
              height={3000}
              className="rounded-lg shadow-lg w-full h-auto"
              priority
              style={{
                width: '100%',
                height: 'auto'
              }}
            />
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
              Last Build: {process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(/\//g, '.').replace(',', '')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}