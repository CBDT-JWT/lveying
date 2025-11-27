'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LotteryConfig, LotteryResult } from '@/types';

export default function LotteryConfigPage() {
  const [config, setConfig] = useState<LotteryConfig>({
    minNumber: 1,
    maxNumber: 100,
    count: 5,
    title: '一等奖',
  });
  const [history, setHistory] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchConfig();
    fetchHistory();
  }, [router]);

  const fetchConfig = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/lottery/config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setConfig(data.config);
    } catch (error) {
      console.error('获取抽奖配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/lottery/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('获取抽奖历史失败:', error);
    }
  };

  const updateConfig = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/lottery/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('配置已更新！');
      }
    } catch (error) {
      console.error('更新配置失败:', error);
    }
  };

  const deleteHistory = async (id: string) => {
    if (!confirm('确定要删除这条抽奖记录吗？')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await fetch('/api/lottery/result', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      fetchHistory();
    } catch (error) {
      console.error('删除记录失败:', error);
    }
  };

  const clearAllHistory = async () => {
    if (!confirm('确定要清空所有抽奖历史吗？此操作不可恢复！')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await fetch('/api/lottery/history', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory([]);
      alert('抽奖历史已清空！');
    } catch (error) {
      console.error('清空历史失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">⚙️ 抽奖设置</h1>
            <div className="flex gap-3">
              <Link
                href="/admin/lottery/display"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                🎁 打开抽奖界面
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
              >
                返回控制台
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：配置区域 */}
            <div className="space-y-6">
              {/* 抽奖参数配置 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  🎲 抽奖参数
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最小号码
                    </label>
                    <input
                      type="number"
                      value={config.minNumber}
                      onChange={(e) =>
                        setConfig({ ...config, minNumber: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最大号码
                    </label>
                    <input
                      type="number"
                      value={config.maxNumber}
                      onChange={(e) =>
                        setConfig({ ...config, maxNumber: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      抽取数量
                    </label>
                    <input
                      type="number"
                      value={config.count}
                      onChange={(e) =>
                        setConfig({ ...config, count: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                    />
                  </div>
                  <button
                    onClick={updateConfig}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    💾 保存配置
                  </button>
                </div>
              </div>

              {/* 奖项名称设置 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  🏆 奖项名称
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      当前奖项
                    </label>
                    <input
                      type="text"
                      value={config.title || ''}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="例如：一等奖"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setConfig({ ...config, title: '特等奖' })}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                    >
                      特等奖
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, title: '一等奖' })}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      一等奖
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, title: '二等奖' })}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                    >
                      二等奖
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, title: '三等奖' })}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                      三等奖
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    💡 修改后点击上方&quot;保存配置&quot;按钮统一保存
                  </p>
                </div>
              </div>
            </div>

            {/* 右侧：抽奖历史 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">📋 抽奖历史</h2>
                <button
                  onClick={clearAllHistory}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all"
                >
                  清空历史
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎁</div>
                  <p className="text-gray-600">暂无抽奖记录</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                          {result.title}
                        </span>
                        <button
                          onClick={() => deleteHistory(result.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️ 删除
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {result.numbers.map((num, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold rounded-lg shadow-lg"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
