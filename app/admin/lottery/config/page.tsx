'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LotteryConfig, LotteryResult } from '@/types';
import * as XLSX from 'xlsx';

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

  const exportToExcel = () => {
    if (history.length === 0) {
      alert('暂无抽奖历史数据可导出');
      return;
    }

    try {
      // 准备Excel数据
      const excelData = history.map((result) => {
        const row: any = {
          '奖项': result.title,
          '时间': new Date(result.timestamp).toLocaleString('zh-CN'),
          '数目': result.numbers.length,
        };

        // 添加中奖序号列，补0至7位
        result.numbers.forEach((number, index) => {
          const paddedNumber = number.toString().padStart(7, '0');
          row[`序号${index + 1}`] = paddedNumber;
        });

        return row;
      });

      // 创建工作簿
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖历史');
      
      // 设置表头样式
      const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: 'center' }
          };
        }
      }

      // 设置列宽
      const colWidths = [
        { wch: 12 }, // 奖项
        { wch: 20 }, // 时间
        { wch: 8 },  // 数目
      ];
      
      // 为中奖序号列添加宽度
      const maxNumbers = Math.max(...history.map(h => h.numbers.length));
      for (let i = 0; i < maxNumbers; i++) {
        colWidths.push({ wch: 12 }); // 中奖序号列
      }
      
      worksheet['!cols'] = colWidths;

      // 生成文件名
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
      const fileName = `抽奖历史_${dateStr}_${timeStr}.xlsx`;

      // 下载文件
      XLSX.writeFile(workbook, fileName);
      
      // 显示成功提示
      alert(`Excel文件已下载: ${fileName}`);
    } catch (error) {
      console.error('导出Excel失败:', error);
      alert('导出Excel文件失败，请重试');
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/guestbg.png')` }}
      >
        <div className="text-gray-800 text-xl drop-shadow-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/guestbg.png')` }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg">抽奖设置</h1>
            <div className="flex gap-3">
              <Link
                href="/admin/lottery/display"
                className="px-6 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl hover:bg-white/30 transition-all"
              >
                打开抽奖界面
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl hover:bg-white/30 transition-all"
              >
                返回控制台
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：配置区域 */}
            <div className="space-y-6">
              {/* 抽奖参数配置 */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 drop-shadow-lg">
                  抽奖参数
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 drop-shadow-lg">
                      最小号码
                    </label>
                    <input
                      type="number"
                      value={config.minNumber}
                      onChange={(e) =>
                        setConfig({ ...config, minNumber: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 drop-shadow-lg">
                      最大号码
                    </label>
                    <input
                      type="number"
                      value={config.maxNumber}
                      onChange={(e) =>
                        setConfig({ ...config, maxNumber: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 drop-shadow-lg">
                      抽取数量
                    </label>
                    <input
                      type="number"
                      value={config.count}
                      onChange={(e) =>
                        setConfig({ ...config, count: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                    />
                  </div>
                  <button
                    onClick={updateConfig}
                    className="w-full py-3 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl font-semibold hover:bg-white/30 transition-all"
                  >
                    保存配置
                  </button>
                </div>
              </div>

              {/* 奖项名称设置 */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 drop-shadow-lg">
                  奖项名称
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 drop-shadow-lg">
                      当前奖项
                    </label>
                    <input
                      type="text"
                      value={config.title || ''}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      className="w-full px-4 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                      placeholder="例如：一等奖"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setConfig({ ...config, title: '特等奖' })}
                      className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-lg hover:bg-white/30 transition-all"
                    >
                      特等奖
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, title: '一等奖' })}
                      className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-lg hover:bg-white/30 transition-all"
                    >
                      一等奖
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, title: '二等奖' })}
                      className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-lg hover:bg-white/30 transition-all"
                    >
                      二等奖
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, title: '三等奖' })}
                      className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-lg hover:bg-white/30 transition-all"
                    >
                      三等奖
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    修改后点击上方"保存配置"按钮统一保存
                  </p>
                </div>
              </div>
            </div>

            {/* 右侧：抽奖历史 */}
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 drop-shadow-lg">抽奖历史</h2>
                <div className="flex gap-2">
                  <button
                    onClick={exportToExcel}
                    className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 text-sm rounded-lg hover:bg-white/30 transition-all"
                  >
                    导出Excel
                  </button>
                  <button
                    onClick={clearAllHistory}
                    className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 text-sm rounded-lg hover:bg-white/30 transition-all"
                  >
                    清空历史
                  </button>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-gray-500">暂无历史</div>
                  <p className="text-gray-600">暂无抽奖记录</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.map((result) => (
                    <div
                      key={result.id}
                      className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-3 py-1 backdrop-blur-md bg-white/30 border border-white/30 text-gray-800 text-sm font-bold rounded-full">
                          {result.title}
                        </span>
                        <button
                          onClick={() => deleteHistory(result.id)}
                          className="text-red-600 hover:text-red-800 text-sm drop-shadow-lg"
                        >
                          删除
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {result.numbers.map((num, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 text-xl font-bold rounded-lg shadow-lg"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 drop-shadow-lg">
                        {new Date(result.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-gray-600 drop-shadow-md">
                    提示：导出Excel格式为第1列奖项，第2列时间，第3列数目，第4-N+3列中奖序号（补0至7位）
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
