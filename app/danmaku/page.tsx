'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import GuestNavBar from '@/components/GuestNavBar';

interface Danmaku {
  id: string;
  content: string;
  timestamp: number;
  censor: boolean;
  censoredAt?: number;
}

export default function DanmakuPage() {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [recentDanmakus, setRecentDanmakus] = useState<Danmaku[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取最近的弹幕
  const fetchRecentDanmakus = async () => {
    try {
      const response = await fetch('/api/danmaku/public');
      const data = await response.json();
      setRecentDanmakus(data.danmakus || []);
    } catch (error) {
      console.error('获取弹幕失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentDanmakus();
    // 每3秒刷新一次
    const interval = setInterval(fetchRecentDanmakus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setMessage('请输入弹幕内容');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const response = await fetch('/api/danmaku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('发送成功！');
        setContent('');
        // 发送成功后立即刷新弹幕列表
        setTimeout(fetchRecentDanmakus, 500);
      } else {
        setMessage(`${data.error || '发送失败'}`);
      }
    } catch (error) {
      setMessage('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8 space-y-6">
        {/* 上半部分：最近弹幕展示 */}
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-800 text-sm drop-shadow-md">加载中...</p>
            </div>
          ) : recentDanmakus.length > 0 ? (
            <div className="space-y-3">
              {recentDanmakus.map((danmaku) => (
                <div key={danmaku.id} className="flex">
                  <div className="backdrop-blur-md bg-white/40 rounded-full px-6 py-2 border border-white/20 hover:bg-white/50 transition-all max-w-full">
                    <p className="text-gray-800 drop-shadow-md break-words">{danmaku.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 drop-shadow-md">暂无弹幕</p>
            </div>
          )}
        </div>

        {/* 下半部分：发送弹幕 */}
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入你想说的话..."
                maxLength={100}
                className="flex-1 px-4 py-3 backdrop-blur-md bg-white/80 border-2 border-white/30 rounded-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
              />
              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="w-14 h-14 backdrop-blur-md bg-gradient-to-r from-blue-500/80 to-cyan-500/80 rounded-full shadow-lg border border-white/30 hover:from-blue-600/80 hover:to-cyan-600/80 transform hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <Image
                  src="/send.png"
                  alt="发送"
                  width={24}
                  height={24}
                  className="drop-shadow-lg"
                />
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 p-4 rounded-xl text-center font-medium backdrop-blur-md border border-white/30 drop-shadow-md ${
                message.includes('成功')
                  ? 'bg-green-400/60 text-white'
                  : 'bg-red-400/60 text-white'
              }`}
            >
              {message}
            </div>
          )}
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
