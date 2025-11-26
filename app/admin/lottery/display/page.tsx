'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LotteryConfig } from '@/types';

interface FlyingNumber {
  id: string | number;
  value: number;
  row: number; // 0 = 上行，1 = 下行
  position: number; // 当前横向位置百分比
  index: number; // 在数字串中的索引
}

export default function LotteryDisplayPage() {
  const [config, setConfig] = useState<LotteryConfig>({
    minNumber: 1,
    maxNumber: 100,
    count: 5,
  });
  const [lotteryTitle, setLotteryTitle] = useState('一等奖');
  const [rolling, setRolling] = useState(false);
  const [finalNumbers, setFinalNumbers] = useState<number[]>([]);
  const [flyingNumbers, setFlyingNumbers] = useState<FlyingNumber[]>([]);
  const [flashEffect, setFlashEffect] = useState(false); // 白色闪光效果
  const [backgroundImage, setBackgroundImage] = useState(''); // 随机背景图片
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set()); // 已经抽过的号码
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const shutterAudioRef = useRef<HTMLAudioElement | null>(null); // 快门音效引用
  const router = useRouter();

  // 根据数量计算需要的行数（每行最多3个）
  const calculateRows = (count: number) => {
    return Math.ceil(count / 3);
  };

  // 格式化数字为6位，前面补0
  const formatNumber = (num: number) => {
    return num.toString().padStart(6, '0');
  };

  // 生成随机数，排除已使用的号码
  const generateRandomNumber = (): number => {
    const availableNumbers = [];
    for (let i = config.minNumber; i <= config.maxNumber; i++) {
      if (!usedNumbers.has(i)) {
        availableNumbers.push(i);
      }
    }
    
    // 如果没有可用号码了，返回随机数（不限制）
    if (availableNumbers.length === 0) {
      return Math.floor(Math.random() * (config.maxNumber - config.minNumber + 1)) + config.minNumber;
    }
    
    // 从可用号码中随机选择
    return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
  };

  // 根据行数计算每行的垂直位置
  const getRowPositions = (totalRows: number) => {
    if (totalRows === 1) return ['50%'];
    if (totalRows === 2) return ['45%', '55%'];
    if (totalRows === 3) return ['40%', '50%', '60%'];
    if (totalRows === 4) return ['35%', '45%', '55%', '65%'];
    // 更多行的情况，均匀分布（更紧密）
    const positions: string[] = [];
    const totalHeight = 40; // 从80%减少到40%，使行更紧密
    const step = totalHeight / (totalRows + 1);
    const startPosition = 50 - totalHeight / 2; // 从中心开始分布
    for (let i = 1; i <= totalRows; i++) {
      positions.push(`${startPosition + step * i}%`);
    }
    return positions;
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchConfig();
    loadLotteryTitle();
    
    // 初始化音频
    if (typeof window !== 'undefined') {
      shutterAudioRef.current = new Audio('/shutter.mp3');
      shutterAudioRef.current.preload = 'auto';
    }
  }, [router]);

  useEffect(() => {
    if (rolling) {
      // 根据配置的数量计算需要的行数
      const requiredRows = calculateRows(config.count);
      const initialNumbers: FlyingNumber[] = [];
      const spacing = 15; // 每个数字间隔15%（增大间距）
      
      // 生成对应行数的数字流
      for (let rowIndex = 0; rowIndex < requiredRows; rowIndex++) {
        for (let i = 0; i < 100; i++) {
          initialNumbers.push({
            id: `row${rowIndex}-${i}`,
            value: generateRandomNumber(), // 使用新函数生成不重复的号码
            row: rowIndex,
            position: i * spacing,
            index: i,
          });
        }
      }
      
      setFlyingNumbers(initialNumbers);
      lastTimeRef.current = performance.now();

      // 动画循环
      const animate = (currentTime: number) => {
        if (!lastTimeRef.current) {
          lastTimeRef.current = currentTime;
        }
        
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;
        
        // 确保 deltaTime 合理（避免第一帧或标签页切换导致的异常值）
        if (deltaTime > 0 && deltaTime < 100) {
          setFlyingNumbers(prev => {
            const updated = prev.map(num => {
              const speed = 2; // 每帧移动2%（速度增加一倍）
              const totalLength = 100 * spacing; // 总长度 1000%
              
              // row 0 和 2：从左向右
              // 偶数行（0, 2, 4...）：从左向右
              // 奇数行（1, 3, 5...）：从右向左
              if (num.row % 2 === 0) {
                let newPos = num.position + speed;
                if (newPos > totalLength) {
                  newPos = newPos - totalLength;
                }
                return { ...num, position: newPos };
              } else {
                let newPos = num.position - speed;
                if (newPos < -spacing) {
                  newPos = totalLength + newPos;
                }
                return { ...num, position: newPos };
              }
            });
            return updated;
          });
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // 停止时取消动画
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = 0;
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rolling, config]);

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

  const fetchUsedNumbers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/lottery/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      // 提取所有历史抽奖中的号码
      const used = new Set<number>();
      if (data.history && Array.isArray(data.history)) {
        data.history.forEach((result: any) => {
          if (result.numbers && Array.isArray(result.numbers)) {
            result.numbers.forEach((num: number) => used.add(num));
          }
        });
      }
      setUsedNumbers(used);
      console.log('已使用的号码:', Array.from(used));
    } catch (error) {
      console.error('获取历史抽奖失败:', error);
    }
  };

  const startLottery = async () => {
    // 先获取已使用的号码
    await fetchUsedNumbers();
    setRolling(true);
    setFinalNumbers([]);
  };

  const stopLottery = () => {
    // 播放快门音效
    if (shutterAudioRef.current) {
      shutterAudioRef.current.currentTime = 0; // 重置到开始
      shutterAudioRef.current.play().catch(err => console.log('音效播放失败:', err));
    }
    
    // 随机选择背景图片 (1-4)
    const randomImageNum = Math.floor(Math.random() * 4) + 1;
    setBackgroundImage(`/max${randomImageNum}.jpg`);
    
    // 延迟0.5秒后触发闪光和定格
    setTimeout(() => {
      // 触发白色闪光效果
      setFlashEffect(true);
      
      // 从当前屏幕上的所有数字中选择，确保横向分散且不重复
      const allNumbers = flyingNumbers.filter(num => 
        num.position >= 10 && 
        num.position <= 90 && 
        !usedNumbers.has(num.value) // 排除已使用的号码
      );
      
      // 按横向位置排序
      const sortedByPosition = [...allNumbers].sort((a, b) => a.position - b.position);
      
      let selectedNumbers: FlyingNumber[] = [];
      const step = Math.floor(sortedByPosition.length / config.count);
      
      // 从排序后的数组中等间隔选择数字
      for (let i = 0; i < config.count && i * step < sortedByPosition.length; i++) {
        selectedNumbers.push(sortedByPosition[i * step]);
      }
      
      // 如果数量不够，补充随机数字（不重复）
      const requiredRows = calculateRows(config.count);
      while (selectedNumbers.length < config.count) {
        const index = selectedNumbers.length;
        const newNumber = generateRandomNumber();
        selectedNumbers.push({
          id: `final-${index}`,
          value: newNumber,
          row: index % requiredRows,
          position: 20 + (index * 60 / config.count),
          index: index,
        });
      }
      
      // 计算所有选中数字的整体中心，并调整位置使其左右居中
      if (selectedNumbers.length > 0) {
        // 重新排列数字位置，使用增大的间距
        const requiredRows = calculateRows(selectedNumbers.length);
        const numbersPerRow = Math.ceil(selectedNumbers.length / requiredRows);
        const numberSpacing = 15; // 使用10%的间距（与飞行数字一致）
        
        // 计算每行的总宽度
        const rowWidth = (numbersPerRow - 1) * numberSpacing;
        
        selectedNumbers = selectedNumbers.map((num, index) => {
          const rowIndex = Math.floor(index / numbersPerRow);
          const posInRow = index % numbersPerRow;
          const numbersInThisRow = Math.min(numbersPerRow, selectedNumbers.length - rowIndex * numbersPerRow);
          const thisRowWidth = (numbersInThisRow - 1) * numberSpacing;
          
          // 居中计算：从50%开始，减去半个行宽，再加上当前位置
          const position = 50 - thisRowWidth / 2 + posInRow * numberSpacing;
          
          return {
            ...num,
            row: rowIndex,
            position: position,
          };
        });
      }
      
      // 在闪光效果期间停止滚动和设置最终数字
      setTimeout(() => {
        setRolling(false);
        setFlyingNumbers(selectedNumbers); // 居中后的位置
        setFinalNumbers(selectedNumbers.map(n => n.value));
        setFlashEffect(false);
        
        // 停止动画
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        submitLotteryResult(selectedNumbers.map(n => n.value));
      }, 100);
    }, 100); // 延迟0.2秒
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
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/lotterybg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* 暗化遮罩层 - 开始抽奖时变暗 */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          rolling ? 'opacity-60' : 'opacity-0'
        }`}
        style={{ pointerEvents: 'none' }}
      />

      {/* 高亮闪光效果 - 高亮度高透明度 */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity ${
          flashEffect ? 'opacity-95' : 'opacity-0'
        }`}
        style={{ 
          pointerEvents: 'none',
          transitionDuration: flashEffect ? '0ms' : '100ms',
          transitionTimingFunction: 'ease-out',
          filter: 'brightness(3)'
        }}
      />
      {/* 停止时显示拍立得背景 - 包裹所有数字 */}
      {!rolling && finalNumbers.length > 0 && (
        (() => {
          // 使用与取景框一致的尺寸
          // 取景框是屏幕宽度的60%，高度的50%
          const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
          
          // 黑框尺寸与取景框一致
          const frameWidth = viewportWidth * 0.6; // 60% 宽度
          const frameHeight = viewportHeight * 0.5; // 50% 高度
          
          // 保持99:62的宽高比调整
          const targetRatio = 99 / 62;
          let finalBlackWidth = frameWidth;
          let finalBlackHeight = frameHeight;
          
          if (frameWidth / frameHeight > targetRatio) {
            // 太宽，减小宽度以保持比例
            finalBlackWidth = frameHeight * targetRatio;
          } else {
            // 太窄，减小高度以保持比例
            finalBlackHeight = frameWidth / targetRatio;
          }
          
          // 白色边框尺寸
          let leftWhite = 4.5 / 62 * finalBlackHeight;
          let rightWhite = 4.5 / 62 * finalBlackHeight;
          let topWhite = 4.5 / 62 * finalBlackHeight;
          let bottomWhite = 4.5 / 62 * finalBlackHeight;
          
          // 白色框总尺寸
          let whiteFrameWidth = finalBlackWidth + leftWhite + rightWhite;
          let whiteFrameHeight = finalBlackHeight + topWhite + bottomWhite;
          
          // 向上偏移量改为0，让拍立得居中
          const verticalOffset = 30;
          
          return (
            <>
              {/* 白色外框 */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: `calc(50% + ${verticalOffset}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: `${whiteFrameWidth}px`,
                  height: `${whiteFrameHeight}px`,
                  backgroundColor: 'white',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                }}
              />
              
              {/* 背景图片层 - 在黑框下方 */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: `calc(50% + ${verticalOffset}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: `${finalBlackWidth}px`,
                  height: `${finalBlackHeight}px`,
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 2,
                }}
              />
              
              {/* 黑色内框 - 半透明 */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: `calc(50% + ${verticalOffset}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: `${finalBlackWidth}px`,
                  height: `${finalBlackHeight}px`,
                  backgroundColor: 'black',
                  opacity: 0.5,
                  zIndex: 3,
                }}
              />
              
              {/* 底部白色矩形 */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: `calc(50% + ${verticalOffset}px + ${finalBlackHeight / 2}px - ${(15 / 62) * finalBlackHeight}px)`,
                  transform: 'translateX(-50%)',
                  width: `${whiteFrameWidth}px`,
                  height: `${(15 / 62) * finalBlackHeight}px`,
                  backgroundColor: 'white',
                  zIndex: 4,
                }}
              />
            </>
          );
        })()
      )}
      
      {/* 滚动的数字 - 动态行数 */}
      {flyingNumbers.map((num) => {
        // 根据当前配置计算行位置
        const totalRows = rolling ? calculateRows(config.count) : calculateRows(finalNumbers.length);
        const rowPositions = getRowPositions(totalRows);
        const verticalOffset = -30; // 向上移动30px
        
        return (
          <div
            key={num.id}
            className="absolute text-4xl font-bold"
            style={{
              top: `calc(${rowPositions[num.row % rowPositions.length]} + ${verticalOffset}px)`,
              left: `${num.position}%`,
              transform: 'translateX(-50%)',
              transition: rolling ? 'none' : 'opacity 0.3s, text-shadow 0.3s',
              zIndex: rolling ? 'auto' : 10,
            }}
          >
            {/* 数字本身 */}
            <span
              style={{
                position: 'relative',
                color: rolling ? 'white' : 'white',
                opacity: rolling ? 0.7 : 1,
                textShadow: rolling ? 'none' : '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 215, 0, 0.8)',
                fontFamily: 'monospace', // 使用等宽字体确保对齐
              }}
            >
              {formatNumber(num.value)}
            </span>
          </div>
        );
      })}

      {/* 录制指示器 - 左上角 */}
      {rolling && (
        <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
          <div 
            className="w-4 h-4 bg-red-600 rounded-full"
            style={{ animation: 'rec-blink 1s step-end infinite' }}
          ></div>
          <span 
            className="text-red-600 text-4xl"
            style={{ 
              fontWeight: 900,
              fontFamily: 'monospace',
              animation: 'rec-blink 1s step-end infinite'
            }}
          >
            REC
          </span>
        </div>
      )}

      {/* 对焦框 - 屏幕中央 */}
      {rolling && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{
            width: '60%',
            height: '50%',
            border: '2px solid rgba(139, 69, 19, 0.6)',
            animation: 'focus-blink 3s ease-in-out infinite',
          }}
        >
          {/* 对焦框四角 */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-700"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-700"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-700"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-700"></div>
        </div>
      )}

      {/* 按钮区域 - 右上角 */}
      <div className="absolute top-8 right-8 flex gap-3 z-20">
        <button
          onClick={startLottery}
          className="w-16 h-16 rounded-full backdrop-blur-lg bg-white/20 hover:bg-white/30 border-2 border-white/50 shadow-lg transform transition-all hover:scale-110 flex items-center justify-center overflow-hidden"
          title="开始抽奖"
        >
          <img src="/play.png" alt="Play" className="w-10 h-10 object-contain" />
        </button>
        <button
          onClick={stopLottery}
          className="w-16 h-16 rounded-full backdrop-blur-lg bg-white/20 hover:bg-white/30 border-2 border-white/50 shadow-lg transform transition-all hover:scale-110 flex items-center justify-center overflow-hidden"
          title="停止抽奖"
        >
          <img src="/shutter.png" alt="Stop" className="w-10 h-10 object-contain" />
        </button>
      </div>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes rec-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
        
        @keyframes focus-blink {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          50% {
            transform: scale(1.15) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

