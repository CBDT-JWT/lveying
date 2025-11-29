// 节目演职人员显示组件
'use client';

import React from 'react';

interface ProgramPerformersDisplayProps {
  performers?: [string | null, string[]][] | null;
  band_name?: string | null;
  className?: string;
  showBandName?: boolean; // 控制是否显示组合名
}

export default function ProgramPerformersDisplay({ performers, band_name, className = '', showBandName = true }: ProgramPerformersDisplayProps) {
  if (!performers && !band_name) {
    return null;
  }

  // 检查特殊情况：只有一个没有职务的演职人员列表
  const isSimpleNameList = performers && 
    performers.length === 1 && 
    (performers[0][0] === null || performers[0][0] === '') && 
    performers[0][1].length > 0;

  // Helper: parse actor entry like "张三(角色)" or "李四（角色）" into name and role
  const parseNameAndRole = (s: string) => {
    const match = s.match(/^(.*?)\s*[（(]\s*(.+?)\s*[)）]\s*$/);
    if (match) {
      return { name: match[1].trim(), role: match[2].trim() };
    }
    return { name: s.trim(), role: '' };
  };

  return (
    <div className={`performers-display ${className}`}>
      {isSimpleNameList ? (
        /* 特殊格式：组名（加粗）换行 名字列表 */
        <div className="simple-format">
          {band_name && showBandName && (
            <div className="band-name mb-1">
              <span className="font-bold text-black">{band_name}</span>
            </div>
          )}
          <div className="names-only text-black">
            {performers[0][1].map((name, nameIndex) => (
              <span key={nameIndex} className="name inline-block whitespace-nowrap mr-1">
                {name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* 标准格式 */
        <>
          {/* 组合名 */}
          {band_name && showBandName && (
            <div className="band-name mb-2">
              <span className="font-semibold text-black">{band_name}</span>
            </div>
          )}
          
          {/* 演职人员列表 */}
          {performers && performers.length > 0 && (
            <div className="performers-list space-y-1">
              {performers.map(([role, names], index) => (
                    <div key={index} className="performer-row flex items-start">
                      {/* 当职务不是演员时，显示左侧职务标签 */}
                      {role !== '演员' && (
                        <div className="role w-24 min-w-[6ch] flex-shrink-0 text-left font-bold text-black">
                          {role && `${role}`}
                        </div>
                      )}

                      {/* 演员特殊处理：每个演员独占一行，居中显示，左名右角色情况 */}
                      {role === '演员' ? (
                        <div className="flex-1 flex flex-col items-center">
                          <div className="actor-label w-full text-center font-bold mb-2">演员</div>
                          <div className="actors w-full max-w-xl">
                            {names.map((entry, nameIndex) => {
                              const { name, role: charRole } = parseNameAndRole(entry);
                              return (
                                <div key={nameIndex} className="actor-row flex items-center py-1 border-b last:border-b-0">
                                  <div className="actor-role w-24 min-w-[6ch] text-left text-sm text-gray-600">{charRole}</div>
                                  <div className="actor-name flex-1 text-right font-medium">{name}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* 其他职务的标准显示 */
                        <div className="names flex-1 text-left text-black">
                          {names.map((name, nameIndex) => (
                            <span key={nameIndex} className="name inline-block whitespace-nowrap mr-1">
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          )}
        </>
      )}
      
      <style jsx>{`
        .performers-display .name {
            display: inline-block;
            word-break: keep-all;
            white-space: nowrap;
            margin-right: 0.25rem;
          }
          .performers-display .actor-row {
            width: 100%;
            padding: 0.25rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0,0,0,0.04);
          }
          .performers-display .actor-row:last-child { border-bottom: none; }
          .performers-display .actor-label { color: #111827; /* text-gray-900 */ }
          .dark .performers-display .actor-label { color: #e5e7eb; /* text-gray-200 */ }
          .performers-display .actor-name {
            white-space: normal;
            word-break: break-word;
            text-align: right;
            color: #111827; /* text-gray-900 */
          }
          .dark .performers-display .actor-name {
            color: #e5e7eb; /* text-gray-200 */
          }
          .performers-display .actor-role {
            white-space: normal;
            word-break: break-word;
            color: #4b5563; /* text-gray-700 */
            text-align: left;
          }
          .dark .performers-display .actor-role {
            color: #9ca3af; /* text-gray-400 */
          }
      `}</style>
    </div>
  );
}