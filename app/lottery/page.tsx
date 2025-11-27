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
  const [backgroundImages, setBackgroundImages] = useState<Record<string, string>>({});

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
  
  // 为每个奖项等级查找所有结果，按时间倒序
  const getPrizeResults = (prizeName: string) => {
    return allResults
      .filter(r => r.title === prizeName)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  // 根据奖项名称获取对应的背景图片
  const getBackgroundImage = (prizeName: string) => {
    const imageMap: Record<string, string> = {
      '特等奖': '/max1.jpg',
      '二等奖': '/max2.jpg',
      '三等奖': '/max3.jpg',
      '一等奖': '/max4.jpg',
    };
    return imageMap[prizeName] || '/max1.jpg';
  };

  // 根据奖项名称获取对应的颜色
  const getPrizeColor = (prizeName: string) => {
    const colorMap: Record<string, string> = {
      '特等奖': 'text-yellow-500', // 金色
      '二等奖': 'text-purple-600', // 紫色
      '三等奖': 'text-green-600',  // 绿色
      '一等奖': 'text-red-600',    // 红色
    };
    return colorMap[prizeName] || 'text-gray-800';
  };

  // 格式化数字为7位
  const formatNumber = (num: number) => {
    return num.toString().padStart(7, '0');
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

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-gray-800 drop-shadow-lg mb-8 text-center">抽奖结果</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-800 font-semibold drop-shadow-md">加载中...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {prizeOrder.map((prizeName) => {
              const results = getPrizeResults(prizeName);
              
              return (
                <div key={prizeName}>
                  {/* 奖项标题 */}
                  <h2 className={`text-3xl font-bold drop-shadow-lg text-center mb-6 ${getPrizeColor(prizeName)}`}>
                    {prizeName}
                  </h2>

                  {results.length === 0 ? (
                    <div className="backdrop-blur-md bg-white/40 rounded-xl p-8 border border-white/20">
                      <div className="text-center py-12">
                        <p className="text-gray-600 drop-shadow-md">请等待开奖</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.map((result) => {
                        // 拍立得尺寸计算 - 适配小屏幕
                        const containerWidth = 400;
                        const containerHeight = 300;
                        
                        const targetRatio = 99 / 62;
                        let finalBlackWidth = containerWidth * 0.8;
                        let finalBlackHeight = containerHeight * 0.7;
                        
                        if (finalBlackWidth / finalBlackHeight > targetRatio) {
                          finalBlackWidth = finalBlackHeight * targetRatio;
                        } else {
                          finalBlackHeight = finalBlackWidth / targetRatio;
                        }
                        
                        const borderSize = 4.5 / 62 * finalBlackHeight;
                        const whiteFrameWidth = finalBlackWidth + borderSize * 2;
                        const whiteFrameHeight = finalBlackHeight + borderSize * 2;
                        const bottomBarHeight = (15 / 62) * finalBlackHeight;
                        
                        return (
                          <div key={result.id} className="backdrop-blur-md bg-white/40 rounded-xl p-6 border border-white/20">
                            {/* 拍立得容器 */}
                            <div className="relative mx-auto flex items-center justify-center" style={{ width: '100%', maxWidth: `${containerWidth}px`, height: `${containerHeight}px` }}>
                              {/* 白色外框 */}
                              <div 
                                className="absolute"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: `${whiteFrameWidth}px`,
                                  height: `${whiteFrameHeight}px`,
                                  backgroundColor: 'white',
                                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                  zIndex: 1,
                                }}
                              />
                              
                              {/* 背景图片层 */}
                              <div 
                                className="absolute"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: `${finalBlackWidth}px`,
                                  height: `${finalBlackHeight}px`,
                                  backgroundImage: `url(${getBackgroundImage(prizeName)})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  zIndex: 2,
                                }}
                              />
                              
                              {/* 黑色半透明遮罩 */}
                              <div 
                                className="absolute"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: `${finalBlackWidth}px`,
                                  height: `${finalBlackHeight}px`,
                                  backgroundColor: 'black',
                                  opacity: 0.5,
                                  zIndex: 3,
                                }}
                              />
                              
                              {/* 数字显示 */}
                              <div 
                                className="absolute flex flex-wrap items-center justify-center px-4"
                                style={{
                                  left: '50%',
                                  top: `calc(50% - ${bottomBarHeight / 2}px)`,
                                  transform: 'translate(-50%, -50%)',
                                  width: `${finalBlackWidth}px`,
                                  zIndex: 4,
                                  columnGap: '12px',
                                  rowGap: '0px',
                                }}
                              >
                                {result.numbers.map((number: number, index: number) => (
                                  <div
                                    key={index}
                                    className="text-white font-bold"
                                    style={{
                                      fontSize: '18px',
                                      fontFamily: 'monospace',
                                      textShadow: '0 0 10px rgba(255, 255, 255, 0.4), 0 0 18px rgba(255, 215, 0, 0.4)',
                                    }}
                                  >
                                    {formatNumber(number)}
                                  </div>
                                ))}
                              </div>
                              
                              {/* 底部白色信息栏 */}
                              <div 
                                className="absolute flex items-center justify-between px-3"
                                style={{
                                  left: '50%',
                                  top: `calc(50% + ${finalBlackHeight / 2}px - ${bottomBarHeight}px)`,
                                  transform: 'translateX(-50%)',
                                  width: `${whiteFrameWidth}px`,
                                  height: `${bottomBarHeight}px`,
                                  backgroundColor: 'white',
                                  zIndex: 5,
                                }}
                              >
                                {/* 左侧 - 掠影2025 */}
                                <span 
                                  className="font-bold text-gray-700"
                                  style={{
                                    fontSize: `${(4 / 62) * finalBlackHeight}px`,
                                    fontFamily: 'serif',
                                  }}
                                >
                                  掠影2025
                                </span>
                                
                                {/* 中间 - 日期 */}
                                <span 
                                  className="font-bold text-gray-700"
                                  style={{
                                    fontSize: `${(4 / 62) * finalBlackHeight}px`,
                                    fontFamily: 'serif',
                                  }}
                                >
                                  {new Date(result.timestamp).toISOString().split('T')[0]}
                                </span>
                                
                                {/* 右侧 - 奖项名称 */}
                                <span 
                                  className="font-bold text-gray-700"
                                  style={{
                                    fontSize: `${(4 / 62) * finalBlackHeight}px`,
                                    fontFamily: 'serif',
                                  }}
                                >
                                  {prizeName}
                                </span>
                              </div>
                            </div>
                            
                            {/* 开奖时间 */}
                            <div className="text-center text-xs text-gray-700 drop-shadow-md mt-4">
                              开奖时间: {new Date(result.timestamp).toLocaleString('zh-CN')}
                            </div>
                          </div>
                        );
                      })}
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
  );
}
