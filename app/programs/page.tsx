'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Program } from '@/types';
import ProgramPerformersDisplay from '@/components/ProgramPerformersDisplay';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import GuestNavBar from '@/components/GuestNavBar';
import BuildTime from '@/components/BuildTime';

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
    return () => {
      clearInterval(interval);
    };
  }, []);



  // 找到正在表演的节目（未完成节目中 id 最小的）
  const currentProgramId = programs
    .filter((p) => !p.completed)
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))[0]?.id;

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // 检查是否是特殊情况：只有一个没有职务的演职人员列表
  const isSimpleNameList = (performers: [string | null, string[]][] | null | undefined) => {
    return performers && 
      performers.length === 1 && 
      (performers[0][0] === null || performers[0][0] === '') && 
      performers[0][1].length > 0;
  };

  // 生成提示文本的函数
  const getToggleText = useCallback((programId: string) => {
    return expandedId === programId ? '▲ 点击收起' : '▼ 点击查看演职人员';
  }, [expandedId]);

  const getCleanNames = useCallback((program: Program) => {
    if (!program.performers) return [] as string[];
    return program.performers.flatMap(([, names]) => names).filter(name => name && name.toString().trim().length > 0);
  }, []);

  // 判断节目是否有可展示的演职信息（乐队名或至少一条含姓名的职位）
  const hasPerformerContent = useCallback((program: Program) => {
    // Only consider performers arrays with at least one non-empty name as content
    if (!program.performers || program.performers.length === 0) return false;
    return program.performers.some(([_, names]) => {
      return Array.isArray(names) && names.some(name => name && name.toString().trim().length > 0);
    });
  }, []);

  // 获取程序显示编号
  const getProgramNumber = (program: Program, index: number) => {
    if (program.parentId) {
      // 子节目显示为 "1.1", "1.2" 等
      const parentIndex = programs.findIndex(p => p.id === program.parentId && !p.parentId);
      const mainProgramNumber = parentIndex + 1;
      return `${mainProgramNumber}.${program.subOrder || 1}`;
    } else {
      // 主节目显示为 "1", "2" 等
      const mainPrograms = programs.filter(p => !p.parentId);
      const mainIndex = mainPrograms.findIndex(p => p.id === program.id);
      return (mainIndex + 1).toString();
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

      <div className="max-w-2xl mx-auto px-4 pt-20">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg mb-6 text-center">节目列表</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-800 font-semibold drop-shadow-md">加载中...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((program, index) => {
                const isCurrentProgram = program.id === currentProgramId;
                const isSubProgram = !!program.parentId;
                const programNumber = getProgramNumber(program, index);
                
                return (
                  <div
                    key={program.id}
                    className={`rounded-xl p-4 transition-all duration-200 backdrop-blur-md border-2 ${
                      isSubProgram ? 'ml-8' : '' // 子节目缩进，增加缩进量因为没有编号了
                    } ${
                      isCurrentProgram
                        ? 'bg-yellow-400/50 border-yellow-500/70 shadow-xl'
                        : program.completed
                        ? 'bg-green-400/40 border-green-300/50'
                        : 'bg-white/40 border-white/30'
                    } ${expandedId === program.id ? 'shadow-lg' : ''} ${
                      hasPerformerContent(program) ? 'cursor-pointer' : ''
                    }`}
                    onClick={(e) => {
                      if (hasPerformerContent(program)) {
                        // 添加视觉反馈
                        const target = e.currentTarget;
                        target.style.transform = 'scale(0.98)';
                        setTimeout(() => {
                          target.style.transform = '';
                        }, 100);
                        
                        toggleExpand(program.id);
                      }
                    }}
                  >
                    <div className="flex items-start">
                      {!isSubProgram && (
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 backdrop-blur-md ${
                            isCurrentProgram
                              ? 'bg-yellow-500/90 text-white'
                              : program.completed
                              ? 'bg-green-500/90 text-white'
                              : 'bg-gray-400/70 text-white'
                          }`}
                        >
                          {programNumber}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-lg drop-shadow-md ${
                          isCurrentProgram
                            ? 'text-yellow-900'
                            : program.completed
                            ? 'text-green-700'
                            : 'text-gray-800'
                        } min-w-0`}>
                          <MarkdownRenderer
                            content={program.title}
                            className="break-all whitespace-normal"
                            style={{ wordBreak: 'break-all' }}
                          />
                        </div>
                      {/* 对于特殊情况，直接显示演职人员信息，不可折叠 */}
                      {isSimpleNameList(program.performers) ? (
                        <div className="mt-3">
                          <ProgramPerformersDisplay 
                            performers={program.performers} 
                            band_name={program.band_name}
                            className="text-sm drop-shadow-md"
                          />
                        </div>
                      ) : (
                        <>
                          {/* 标准情况：简短显示组合名或主要演职人员 */}
                          {((program.band_name && program.band_name.trim().length > 0) || hasPerformerContent(program)) && (
                            <p className="text-sm text-gray-800 mt-1 drop-shadow-md">
                              {program.band_name || (getCleanNames(program).length > 0 ? 
                                getCleanNames(program).slice(0, 2).join(' ') + 
                                (getCleanNames(program).length > 2 ? '等' : '') : '')}
                            </p>
                          )}
                          
                          {/* 展开的详情内容 */}
                          {expandedId === program.id && hasPerformerContent(program) && (
                            <div className="mt-3">
                              <ProgramPerformersDisplay 
                                performers={program.performers} 
                                band_name={program.band_name}
                                className="text-sm drop-shadow-md"
                                showBandName={false}
                              />
                            </div>
                          )}
                          
                          {/* 如果有演职人员信息，显示展开提示 */}
                          {hasPerformerContent(program) && (
                            <p className="text-xs text-gray-700 mt-2 drop-shadow-md">
                              {getToggleText(program.id)}
                            </p>
                          )}
                        </>
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
            <BuildTime />
          </p>
        </div>
      </div>
    </div>
  );
}
