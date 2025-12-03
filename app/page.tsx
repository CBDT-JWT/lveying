'use client';

import GuestNavBar from '@/components/GuestNavBar';
import Image from 'next/image';
import { useState } from 'react';

interface FlyingS {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  size: number;
}

export default function Home() {
  const [exploded, setExploded] = useState(false);
  const [flyingS, setFlyingS] = useState<FlyingS[]>([]);

  const handleServerClick = () => {
    if (exploded) return;
    
    setExploded(true);
    
    // 生成50个飞散的"S"
    const newFlyingS: FlyingS[] = [];
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 20;
      newFlyingS.push({
        id: i,
        x: 30, // server图标中心位置
        y: window.innerHeight - 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // 向上偏移
        rotation: Math.random() * 360,
        size: 20 + Math.random() * 40,
      });
    }
    setFlyingS(newFlyingS);

    // 动画
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame > 300) { // 5秒后停止
        setExploded(false);
        setFlyingS([]);
        return;
      }

      setFlyingS(prev => prev.map(s => ({
        ...s,
        x: s.x + s.vx,
        y: s.y + s.vy,
        vy: s.vy + 0.3, // 重力
        rotation: s.rotation + 5,
      })));

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

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
        <div className="relative backdrop-blur-lg bg-white/30 rounded-2xl shadow-2xl overflow-visible border border-white/20 p-6">
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
              <p className="text-gray-700 text-left">
                欢迎参加本次学生节！请使用上方导航栏查看节目进度、抽奖结果和发送弹幕互动。
                
              </p><br />
              <p className="text-gray-700 text-left">
                电子系学生节始创于1999年，是一场集舞台剧、DV 作品、歌曲、舞蹈、器乐、相声等于一体的综合性原创晚会。电子系学生节的筹备贯穿整个秋季学期，为电子系的同学们提供了广阔的展示平台。二十七年来，电子系学生节以其丰富的原创内容、独特的精神关怀以及轻松娱乐的氛围在电子系乃至于清华大学的同学们之中得到了广泛的关注。
              </p>

              <br/>
              <p className="text-gray-700 text-left">
                “掠影”，寓意是“电子系同学的生活掠影”，代表着电子系学子日常里那些鲜活又珍贵的切片。而学生节，正是这些“生活掠影”的集中定格与温暖回响。这场以“掠影”为名的学生节，既是对过往时光的回望与致敬，也是对电子系独有的青春图景的生动呈现——那些零散却闪光的瞬间，终将串联成最珍贵的青春记忆，成为未来回望时最温暖的注脚。
              </p>
              <br/>
              <p className="text-gray-700 text-left">
                更多信息敬请参考:</p>
              <p className="text-gray-700 text-center">
                <a href="https://mp.weixin.qq.com/s/F_FFAVio_1wCcsqHtuzvAg" className="underline">掠影 | 不要掠过那个瞬间</a><br/>
                 <a href="https://mp.weixin.qq.com/s/TpUp6TUaaXE1UOsH5knKgg" className="underline">掠影 | 主海报发布</a><br/>
                 <a href="https://mp.weixin.qq.com/s/WKw7fFFJr_-eKgKdXBaYMQ" className="underline">掠影 | 路演来啦！</a>
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
            {/*<div className="text-center text-sm text-black pt-2">
              <p>2025年12月5日</p>
              <br />
              <p>大礼堂</p>
            </div> */}
          </div>
        </div>
        
        {/* server.png 图标 - 站在页面底部 */}
        <div 
          className="fixed bottom-0 left-6 z-50 cursor-pointer transition-transform hover:scale-110"
          onClick={handleServerClick}
          style={{
            opacity: exploded ? 0 : 1,
            transition: exploded ? 'opacity 0.3s' : 'none',
          }}
        >
          <Image 
            src="/server.png" 
            alt="Server" 
            width={3}
            height={3}
            className="object-contain"
          />
        </div>

        {/* 爆炸的"S"字母 */}
        {flyingS.map(s => (
          <div
            key={s.id}
            className="fixed text-white font-bold pointer-events-none z-50"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              fontSize: `${s.size}px`,
              transform: `rotate(${s.rotation}deg)`,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
            }}
          >
            S
          </div>
        ))}
        
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
