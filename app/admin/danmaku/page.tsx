'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Danmaku } from '@/types';

export default function AdminDanmakuPage() {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showOnlyPending, setShowOnlyPending] = useState(false);
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

  const deleteDanmaku = async (id: string) => {
    if (!confirm('确定要删除这条弹幕吗？')) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setDeleting(id);
    try {
      const response = await fetch('/api/danmaku', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setDanmakus(danmakus.filter(d => d.id !== id));
      } else {
        console.error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setDeleting(null);
    }
  };

  // 筛选弹幕
  const filteredDanmakus = showOnlyPending 
    ? danmakus.filter(d => !d.censor)
    : danmakus;

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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg">弹幕管理</h1>
              
              {/* 筛选开关 */}
              <div className="flex items-center gap-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyPending}
                    onChange={(e) => setShowOnlyPending(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-all backdrop-blur-md border ${
                    showOnlyPending 
                      ? 'bg-purple-500/60 border-purple-400/50' 
                      : 'bg-white/20 border-white/30'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-lg ${
                      showOnlyPending ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-800 drop-shadow-lg">
                    仅显示待审核
                  </span>
                </label>
              </div>
            </div>
            
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
              <div className="text-sm text-blue-600 mb-1">
                {showOnlyPending ? '显示中' : '弹幕总数'}
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {filteredDanmakus.length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-green-600 mb-1">已审核</div>
              <div className="text-3xl font-bold text-green-700">
                {danmakus.filter((d) => d.censor).length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-sm text-purple-600 mb-1">待审核</div>
              <div className="text-3xl font-bold text-purple-700">
                {danmakus.filter((d) => !d.censor).length}
              </div>
            </div>
          </div>

          {/* 弹幕列表 */}
          {filteredDanmakus.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-500">
                {showOnlyPending ? '🎯' : '📝'}
              </div>
              <p className="text-gray-600 text-lg">
                {showOnlyPending ? '暂无待审核弹幕' : '暂无弹幕'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredDanmakus.map((danmaku) => (
                <div
                  key={danmaku.id}
                  className={`rounded-xl p-4 transition-all backdrop-blur-sm border border-white/20 ${
                    danmaku.censor 
                      ? 'bg-white/10' 
                      : 'bg-purple-400/20 border-purple-300/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded backdrop-blur-md border ${
                            danmaku.censor
                              ? 'bg-green-400/20 border-green-300/30 text-green-700'
                              : 'bg-purple-400/20 border-purple-300/30 text-purple-700'
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
                        className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-md border text-white ${
                          danmaku.censor
                            ? 'bg-gray-500/60 border-gray-400/50 hover:bg-gray-500/80'
                            : 'bg-green-500/60 border-green-400/50 hover:bg-green-500/80'
                        }`}
                      >
                        {danmaku.censor ? '取消审核' : '审核通过'}
                      </button>
                      <button
                        onClick={() => deleteDanmaku(danmaku.id)}
                        disabled={deleting === danmaku.id}
                        className="px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-md bg-red-500/60 border border-red-400/50 text-white hover:bg-red-500/80 disabled:opacity-50"
                      >
                        {deleting === danmaku.id ? '删除中...' : '删除'}
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
