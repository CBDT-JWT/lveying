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
    const str = (s || '').toString().trim();

    // 1) 常见括号：张三(角色) 或 张三（角色）
    let m = str.match(/^(.*?)\s*[（(]\s*(.+?)\s*[)）]\s*$/);
    if (m) return { name: m[1].trim(), role: m[2].trim() };

    // 2) 常见分隔符：姓名 - 角色, 姓名:角色, 姓名/角色
    m = str.match(/^(.+?)\s*[:：\-–—\/]\s*(.+)$/);
    if (m) return { name: m[1].trim(), role: m[2].trim() };

    // 3) 有些数据可能是“角色: 姓名”这种反向格式，尝试根据已知的职务关键词判断并交换
    const reverseMatch = str.match(/^(.+?)\s*[:：\-–—\/]\s*(.+)$/);
    if (reverseMatch) {
      const left = reverseMatch[1].trim();
      const right = reverseMatch[2].trim();
      const roleKeywords = ['导演', '演员', '编剧', '主持', '主唱', '魔术', '编导', '表演', '配角', '主演'];
      if (roleKeywords.some(k => left.includes(k))) {
        return { name: right, role: left };
      }
      // 否则按常规 name/role 返回
      return { name: left, role: right };
    }

    // 4) 回退：未识别的格式，全部作为姓名返回
    return { name: str, role: '' };
  };

  const formatTwoCharName = (s: string) => {
    const trimmed = (s || '').toString().trim();
    const chars = Array.from(trimmed);
    if (chars.length === 2 && !trimmed.includes(' ') && !trimmed.includes('　')) {
      return `${chars[0]}　${chars[1]}`;
    }
    return trimmed;
  };

  return (
    <div className={`performers-display ${className}`}>
      {/* Debug helper: 在 URL 中添加 ?dbg=1 可显示原始数据与解析结果（只在客户端） */}
      {/* 例如: https://your-site/programs?dbg=1 */}
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('dbg') === '1' && (
        <div className="debug-panel mb-2 p-2 bg-yellow-50 rounded border border-yellow-200 text-xs text-yellow-800">
          <div className="font-medium mb-1">DEBUG: 原始 performers 数据</div>
          <pre className="whitespace-pre-wrap">{JSON.stringify(performers, null, 2)}</pre>
        </div>
      )}
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
              {performers.map(([role, names], index) => {
                const isActor = role === '演员';
                const actorGroups = isActor
                  ? (() => {
                      const map = new Map<string, string[]>();
                      names.forEach((entry) => {
                        const { name, role: charRole } = parseNameAndRole(entry);
                        const key = charRole || '';
                        const parts = name.split('、').map((p) => p.trim()).filter(Boolean);
                        if (!map.has(key)) map.set(key, []);
                        map.get(key)!.push(...parts);
                      });
                      return Array.from(map.entries()).map(([charRole, grouped]) => ({
                        charRole,
                        names: grouped,
                      }));
                    })()
                  : [];
                return (
                  <div
                    key={index}
                    className={`performer-section flex flex-col items-center ${index > 0 ? 'section-divider pt-3 mt-3' : ''}`}
                  >
                    {isActor && role && <div className="actor-label w-full text-center font-bold mb-1">{role}</div>}
                    <div className="actors w-full max-w-xl">
                      {isActor ? (
                        actorGroups.flatMap(({ charRole, names: actorNames }, groupIndex) => {
                          return (
                            <div key={groupIndex} className={`actor-row flex items-center py-0 ${groupIndex > 0 ? 'mt-2' : ''}`}>
                              <div className="actor-role w-24 min-w-[6ch] text-left text-sm text-gray-600">{charRole}</div>
                              <div className="actor-names flex flex-1 flex-wrap justify-end gap-x-4 gap-y-0.5">
                                {actorNames.map((name, nameIndex) => (
                                  <div key={nameIndex} className="actor-name actor-name-block text-right font-medium">
                                    {formatTwoCharName(name)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="actor-row flex items-center py-0">
                          <div className="actor-role w-24 min-w-[6ch] text-left text-sm text-gray-600">
                            {role || ''}
                          </div>
                          <div className="names-row flex flex-1 flex-wrap gap-x-4 gap-y-0.5">
                            {names.map((name, nameIndex) => (
                              <div
                                key={nameIndex}
                                className="non-actor-name text-right font-medium"
                              >
                                {formatTwoCharName(name)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
            padding: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 1.4;
          }
          .performers-display .performer-section + .performer-section {
            border-top: 1px solid rgba(0,0,0,0.08);
          }
          .performers-display .actor-label { color: #111827; /* text-gray-900 */ }
          .dark .performers-display .actor-label { color: #e5e7eb; /* text-gray-200 */ }
          .performers-display .actor-name {
            white-space: normal;
            word-break: break-word;
            text-align: right;
            color: #000;
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
          .performers-display .actor-names {
            justify-content: flex-end;
          }
          .performers-display .actor-name-block {
            flex: 0 0 4em;
            width: 4em;
            min-width: 4em;
          }
          .performers-display .names-row {
            justify-content: flex-end;
          }
          .performers-display .non-actor-name {
            color: #000;
            text-align: right;
            flex: 0 0 4em;
            width: 4em;
            min-width: 4em;
          }
      `}</style>
    </div>
  );
}
