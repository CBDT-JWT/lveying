'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Danmaku } from '@/types';

export default function AdminDanmakuPage() {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchDanmakus();
    // 每3秒自动刷新
    const interval = setInterval(fetchDanmakus, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchDanmakus = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/danmaku', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDanmakus(data.danmakus);
    } catch (error) {
      console.error('获取弹幕失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopying(id);
      setTimeout(() => setCopying(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const clearAllDanmakus = async () => {
    if (!confirm('确定要清空所有弹幕吗？')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await fetch('/api/danmaku', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDanmakus([]);
    } catch (error) {
      console.error('清空弹幕失败:', error);
    }
  };

  const toggleCensor = async (id: string, currentCensor: boolean) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/danmaku', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, censor: !currentCensor }),
      });

      if (response.ok) {
        setDanmakus(
          danmakus.map((d) =>
            d.id === id ? { ...d, censor: !currentCensor } : d
          )
        );
      }
    } catch (error) {
      console.error('更新审核状态失败:', error);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/guestbg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-gray-800 text-xl font-semibold drop-shadow-lg backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 p-8">
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: 'url(/guestbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg">弹幕管理</h1>
            <div className="flex gap-3">
              <button
                onClick={clearAllDanmakus}
                className="px-6 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl hover:bg-white/30 transition-all"
              >
                清空弹幕
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl hover:bg-white/30 transition-all"
              >
                返回控制台
              </Link>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-sm text-blue-600 mb-1">弹幕总数</div>
              <div className="text-3xl font-bold text-blue-700">
                {danmakus.length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-green-600 mb-1">已审核</div>
              <div className="text-3xl font-bold text-green-700">
                {danmakus.filter((d) => d.censor).length}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="text-sm text-orange-600 mb-1">待审核</div>
              <div className="text-3xl font-bold text-orange-700">
                {danmakus.filter((d) => !d.censor).length}
              </div>
            </div>
          </div>

          {/* 弹幕列表 */}
          {danmakus.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-500">无弹幕</div>
              <p className="text-gray-600 text-lg">暂无弹幕</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {danmakus.map((danmaku) => (
                <div
                  key={danmaku.id}
                  className="rounded-xl p-4 transition-all backdrop-blur-sm bg-white/10 border border-white/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded backdrop-blur-md bg-white/20 border border-white/30 ${
                            danmaku.censor
                              ? 'text-green-700'
                              : 'text-orange-700'
                          }`}
                        >
                          {danmaku.censor ? '已审核' : '待审核'}
                        </span>
                      </div>
                      <p className="text-gray-800 text-lg mb-2 drop-shadow-lg">
                        {danmaku.content}
                      </p>
                      <p className="text-sm text-gray-600 drop-shadow-lg">
                        {new Date(danmaku.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => toggleCensor(danmaku.id, danmaku.censor)}
                        className="px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 hover:bg-white/30"
                      >
                        {danmaku.censor ? '取消审核' : '审核通过'}
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(danmaku.content, danmaku.id)
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 ${
                          copying === danmaku.id
                            ? 'text-green-700'
                            : 'text-gray-800'
                        }`}
                      >
                        {copying === danmaku.id ? '已复制' : '复制'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
