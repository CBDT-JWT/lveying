'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LotteryConfig } from '@/types';

export default function LotteryDisplayPage() {
  const [config, setConfig] = useState<LotteryConfig>({
    minNumber: 1,
    maxNumber: 100,
    count: 5,
  });
  const [lotteryTitle, setLotteryTitle] = useState('一等奖');
  const [rolling, setRolling] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([]);
  const [finalNumbers, setFinalNumbers] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchConfig();
    loadLotteryTitle();
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
    }
  };

  const loadLotteryTitle = () => {
    const savedTitle = localStorage.getItem('lotteryTitle');
    if (savedTitle) {
      setLotteryTitle(savedTitle);
    }
  };

  const generateRandomNumber = () => {
    return (
      Math.floor(Math.random() * (config.maxNumber - config.minNumber + 1)) +
      config.minNumber
    );
  };

  const startLottery = () => {
    setRolling(true);
    setFinalNumbers([]);
    
    // 初始化显示数字
    setDisplayNumbers(Array(config.count).fill(0).map(() => generateRandomNumber()));

    // 滚动效果
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDisplayNumbers(Array(config.count).fill(0).map(() => generateRandomNumber()));
      rollCount++;

      if (rollCount >= 20) {
        clearInterval(rollInterval);
        // 生成最终结果（不重复）
        const results: number[] = [];
        while (results.length < config.count) {
          const num = generateRandomNumber();
          if (!results.includes(num)) {
            results.push(num);
          }
        }
        setFinalNumbers(results);
        setDisplayNumbers(results);
        setRolling(false);

        // 提交结果到服务器
        submitLotteryResult(results);
      }
    }, 100);
  };

  const submitLotteryResult = async (numbers: number[]) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/lottery/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: lotteryTitle, numbers }),
      });

      if (response.ok) {
        console.log('抽奖结果已保存');
      }
    } catch (error) {
      console.error('提交抽奖结果失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      {/* 顶部导航 */}
      <div className="absolute top-4 right-4 flex gap-3">
        <Link
          href="/admin/lottery/config"
          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-sm"
        >
          ⚙️ 设置
        </Link>
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-sm"
        >
          返回
        </Link>
      </div>

      {/* 主内容区 */}
      <div className="w-full max-w-6xl">
        {/* 奖项名称 */}
        <div className="text-center mb-12">
          <h1 className="text-8xl font-bold text-white mb-4 drop-shadow-2xl animate-pulse">
            🎁 {lotteryTitle}
          </h1>
          <p className="text-2xl text-white/80">
            号码范围：{config.minNumber} - {config.maxNumber} | 抽取 {config.count} 个
          </p>
        </div>

        {/* 数字显示区域 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 mb-12 shadow-2xl">
          <div className="flex justify-center items-center flex-wrap gap-6">
            {displayNumbers.length > 0 ? (
              displayNumbers.map((num, index) => (
                <div
                  key={index}
                  className={`w-32 h-32 flex items-center justify-center rounded-2xl font-bold text-6xl shadow-2xl transform transition-all ${
                    rolling
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-110 animate-bounce'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 scale-100'
                  } text-white`}
                >
                  {num}
                </div>
              ))
            ) : (
              <div className="text-white/50 text-4xl">准备开始...</div>
            )}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center">
          <button
            onClick={startLottery}
            disabled={rolling}
            className={`px-16 py-8 text-4xl font-bold rounded-2xl shadow-2xl transform transition-all ${
              rolling
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-blue-500 hover:scale-110 hover:shadow-3xl'
            } text-white`}
          >
            {rolling ? '🎲 抽奖中...' : '🚀 开始抽奖'}
          </button>
        </div>

        {/* 结果提示 */}
        {finalNumbers.length > 0 && !rolling && (
          <div className="mt-12 text-center animate-bounce">
            <p className="text-4xl text-white font-bold drop-shadow-lg">
              🎉 恭喜中奖！🎉
            </p>
          </div>
        )}
      </div>

      {/* 全屏提示 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        💡 提示：按 F11 进入全屏模式以获得最佳效果
      </div>
    </div>
  );
}
