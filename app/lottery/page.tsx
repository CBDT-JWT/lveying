'use client';

import { useEffect, useState } from 'react';
import GuestNavBar from '@/components/GuestNavBar';

interface LotteryResult {
  id: string;
  title: string;
  numbers: number[];
  timestamp: number;
}

export default function LotteryPage() {
  const [allResults, setAllResults] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLotteryResults = async () => {
    try {
      const response = await fetch('/api/lottery/history');
      const data = await response.json();
      setAllResults(data.history || []);
    } catch (error) {
      console.error('获取抽奖结果失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotteryResults();
    // 每5秒刷新一次
    const interval = setInterval(fetchLotteryResults, 5000);
    return () => clearInterval(interval);
  }, []);

  // 定义奖项等级顺序
  const prizeOrder = ['特等奖', '一等奖', '二等奖', '三等奖'];
  
  // 为每个奖项等级查找最新的结果
  const getPrizeResult = (prizeName: string) => {
    return allResults
      .filter(r => r.title === prizeName)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
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

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg mb-6 text-center">抽奖结果</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-800 font-semibold drop-shadow-md">加载中...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {prizeOrder.map((prizeName) => {
                const result = getPrizeResult(prizeName);
                
                return (
                  <div key={prizeName} className="backdrop-blur-md bg-white/40 rounded-xl p-6 border border-white/20">
                    {/* 奖项标题 */}
                    <div className="text-center mb-4">
                      <h2 className={`text-2xl font-bold drop-shadow-lg ${
                        prizeName === '特等奖' ? 'text-yellow-600' :
                        prizeName === '一等奖' ? 'text-red-600' :
                        prizeName === '二等奖' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {prizeName}
                      </h2>
                    </div>

                    {result ? (
                      <div className="space-y-3">
                        {/* 中奖号码 - 每行一个 */}
                        <div className="backdrop-blur-md bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-lg p-4 border border-white/20">
                          <div className="space-y-2">
                            {result.numbers.map((number, index) => (
                              <div
                                key={index}
                                className="backdrop-blur-md bg-white/80 rounded-lg p-3 text-center shadow-md border border-white/30"
                              >
                                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                  {number}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* 开奖时间 */}
                        <div className="text-center text-xs text-gray-700 drop-shadow-md">
                          开奖时间: {new Date(result.timestamp).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 drop-shadow-md">请等待开奖</p>
                      </div>
                    )}
                  </div>
                );
              })}
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
