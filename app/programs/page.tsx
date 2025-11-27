'use client';

import { useEffect, useState } from 'react';
import { Program } from '@/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import GuestNavBar from '@/components/GuestNavBar';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      setPrograms(data.programs);
    } catch (error) {
      console.error('获取节目单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    // 每10秒刷新一次
    const interval = setInterval(fetchPrograms, 10000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = programs.filter((p) => p.completed).length;
  const progress = programs.length > 0 ? (completedCount / programs.length) * 100 : 0;

  // 找到正在表演的节目（未完成节目中 id 最小的）
  const currentProgramId = programs
    .filter((p) => !p.completed)
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))[0]?.id;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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

      <div className="max-w-2xl mx-auto px-4 pt-20">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg mb-6 text-center">节目列表</h1>

          {/* 进度条 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800 drop-shadow-md">
                整体进度
              </span>
              <span className="text-sm font-medium text-gray-800 drop-shadow-md">
                {completedCount}/{programs.length}
              </span>
            </div>
            <div className="w-full backdrop-blur-md bg-gray-300/60 rounded-full h-3 overflow-hidden border border-white/20">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-800 font-semibold drop-shadow-md">加载中...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((program, index) => {
                const isCurrentProgram = program.id === currentProgramId;
                return (
                  <div
                    key={program.id}
                    className={`rounded-xl p-4 transition-all cursor-pointer backdrop-blur-md border-2 ${
                      isCurrentProgram
                        ? 'bg-yellow-400/50 border-yellow-500/70 shadow-xl'
                        : program.completed
                        ? 'bg-green-400/40 border-green-300/50'
                        : 'bg-white/40 border-white/30'
                    } ${expandedId === program.id ? 'shadow-lg' : ''}`}
                    onClick={() => toggleExpand(program.id)}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 backdrop-blur-md ${
                          isCurrentProgram
                            ? 'bg-yellow-500/90 text-white'
                            : program.completed
                            ? 'bg-green-500/90 text-white'
                            : 'bg-gray-400/70 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg drop-shadow-md ${
                            isCurrentProgram
                              ? 'text-yellow-900'
                              : program.completed
                              ? 'text-green-700'
                            : 'text-gray-800'
                        }`}
                      >
                        {program.title}
                      </h3>
                      {program.performer && (
                        <p className="text-sm text-gray-800 mt-1 drop-shadow-md">
                          {program.performer}
                        </p>
                      )}
                      
                      {/* 展开的详情内容 */}
                      {expandedId === program.id && program.info && (
                        <div className="mt-3">
                          <div className="backdrop-blur-md bg-white/80 rounded-lg p-3 border border-white/30">
                            <MarkdownRenderer content={program.info} />
                          </div>
                        </div>
                      )}
                      
                      {/* 如果有 info 字段，显示展开提示 */}
                      {program.info && (
                        <p className="text-xs text-gray-700 mt-2 drop-shadow-md">
                          {expandedId === program.id ? '▲ 点击收起' : '▼ 点击查看详情'}
                        </p>
                      )}
                    </div>
                  </div>
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
    </div>
  );
}
