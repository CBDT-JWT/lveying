'use client';

import GuestNavBar from '@/components/GuestNavBar';
import Image from 'next/image';

export default function Home() {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/guestbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 导航栏 */}
      <GuestNavBar />

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        {/* 透明毛玻璃框 */}
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-2xl overflow-hidden border border-white/20 p-6">
          {/* 海报图片 */}
          <div className="relative w-full mb-6" style={{ aspectRatio: '3/4' }}>
            <Image 
              src="/poster.png" 
              alt="活动海报" 
              fill
              className="object-contain rounded-xl"
              priority
            />
          </div>

          {/* 文字和链接内容 */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">掠影</h2>
              <p className="text-lg text-gray-600">电子系第27届学生节</p>
            </div>

            <div className="border-t border-black/30 pt-4">
              <p className="text-gray-700 text-center leading-relaxed">
                欢迎参加本次活动！请使用上方导航栏查看节目进度、抽奖结果和发送弹幕互动。
              </p>
            </div>

            {/* 快捷链接 */}
            {/* <div className="grid grid-cols-2 gap-3 pt-2">
              <a 
                href="/programs" 
                className="block text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                📋 节目单
              </a>
              <a 
                href="/lottery" 
                className="block text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                🎁 抽奖
              </a>
            </div> */}

            {/* 底部信息 */}
            <div className="text-center text-sm text-black pt-2">
              <p>活动时间：2025年12月5日</p>
              {/* <p className="mt-1">主办方：电子系学生会</p> */}
            </div>
          </div>
        </div>
        
        {/* 制作信息 */}
        <div className="text-center mt-4 pb-4">
          <p className="text-sm text-gray-800 drop-shadow-md">
            © 2025 <a href="https://www.jiangwt.org" target="_blank" rel="noopener noreferrer" className="hover:underline">江玮陶</a>
            {' | '}
            <a href="https://github.com/CBDT-JWT/lveying" target="_blank" rel="noopener noreferrer" className="hover:underline">Github</a>
          </p>
        </div>
      </div>
    </div>
  );
}
