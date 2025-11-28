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
                <div key={index} className="performer-row flex">
                  {/* 职务 - 左对齐，固定宽度，加粗 */}
                  <div className="role w-16 flex-shrink-0 text-left font-bold text-black">
                    {role && `${role}`}
                  </div>
                  
                  {/* 人名 - 左对齐，不换行 */}
                  <div className="names flex-1 text-left text-black">
                    {names.map((name, nameIndex) => (
                      <span key={nameIndex} className="name inline-block whitespace-nowrap mr-1">
                        {name}
                      </span>
                    ))}
                  </div>
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
      `}</style>
    </div>
  );
}