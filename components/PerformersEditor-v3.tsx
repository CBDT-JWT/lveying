// 演职人员编辑器组件 - 极简版本，输入不做任何处理
'use client';

import React, { useState, useEffect } from 'react';

interface PerformersEditorProps {
  performers?: [string | null, string[]][] | null;
  band_name?: string | null;
  onUpdate: (performers: [string | null, string[]][] | null, band_name: string | null) => void;
  className?: string;
}

export default function PerformersEditor({ performers, band_name, onUpdate, className = '' }: PerformersEditorProps) {
  // 本地状态 - 纯字符串存储，不做任何处理
  const [roles, setRoles] = useState<Array<{ role: string; names: string }>>([]);
  const [bandName, setBandName] = useState<string>('');

  // 初始化状态
  useEffect(() => {
    console.log('初始化 - performers:', performers, 'band_name:', band_name);
    
    // 初始化角色和姓名
    if (performers && performers.length > 0) {
      const initialRoles = performers.map(([role, names]) => ({
        role: role || '',
        names: names.join(' ') // 仅在初始化时连接
      }));
      setRoles(initialRoles);
    } else {
      setRoles([]);
    }
    
    // 初始化乐队名
    setBandName(band_name || '');
  }, [performers, band_name]);

  // 处理数据并通知父组件的函数（仅在需要保存时调用）
  const processAndNotify = (currentRoles: Array<{ role: string; names: string }>, currentBandName: string) => {
    const performersData: [string | null, string[]][] = currentRoles.map(({ role, names }) => {
      // 仅在这里处理：按空格分割，过滤空字符串
      const nameArray = names.trim() ? names.split(/\s+/).filter(name => name.length > 0) : [];
      return [role || null, nameArray];
    });

    const finalPerformers = performersData.length > 0 ? performersData : null;
    const finalBandName = currentBandName.trim() || null;
    
    console.log('处理并通知父组件 - performers:', finalPerformers, 'bandName:', finalBandName);
    onUpdate(finalPerformers, finalBandName);
  };

  // 添加新角色
  const addRole = () => {
    const newRoles = [...roles, { role: '', names: '' }];
    setRoles(newRoles);
    // 添加时立即处理
    processAndNotify(newRoles, bandName);
  };

  // 删除角色
  const removeRole = (index: number) => {
    const newRoles = roles.filter((_, i) => i !== index);
    setRoles(newRoles);
    // 删除时立即处理
    processAndNotify(newRoles, bandName);
  };

  // 更新角色名称 - 纯输入，不做处理
  const updateRole = (index: number, newRole: string) => {
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], role: newRole };
    setRoles(newRoles);
    // 不立即通知父组件
  };

  // 更新姓名 - 纯输入，不做任何处理
  const updateNames = (index: number, newNames: string) => {
    console.log(`更新姓名 - index: ${index}, names: "${newNames}"`);
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], names: newNames };
    setRoles(newRoles);
    // 不立即通知父组件
  };

  // 更新乐队名 - 纯输入，不做处理
  const updateBandName = (newBandName: string) => {
    setBandName(newBandName);
    // 不立即通知父组件
  };

  // 失去焦点时处理数据
  const handleBlur = () => {
    processAndNotify(roles, bandName);
  };

  return (
    <div className={`performers-editor space-y-4 ${className}`}>
      {/* 组合名编辑 */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">组合名（可选）：</label>
        <input
          type="text"
          value={bandName}
          onChange={(e) => updateBandName(e.target.value)}
          onBlur={handleBlur}
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="例如：北京大学合唱团"
        />
      </div>

      {/* 演职人员编辑 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">演职人员：</label>
          <button
            onClick={addRole}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            添加职务
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((item, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              {/* 职务输入 */}
              <div className="w-24">
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => updateRole(index, e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="职务"
                />
              </div>

              {/* 姓名输入 */}
              <div className="flex-1">
                <input
                  type="text"
                  value={item.names}
                  onChange={(e) => updateNames(index, e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="人名（用空格分隔）"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  提示：可以在任何位置输入空格。多个人名用空格分隔。
                </p>
              </div>

              {/* 删除按钮 */}
              <button
                onClick={() => removeRole(index)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          ))}

          {roles.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              暂无演职人员，点击上方&quot;添加职务&quot;按钮开始添加
            </p>
          )}
        </div>
      </div>

      {/* 预览 */}
      {(roles.length > 0 || bandName) && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">预览效果：</h4>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {bandName && (
              <div className="font-semibold mb-1 text-gray-900 dark:text-white">{bandName}</div>
            )}
            {roles.map((item, index) => {
              // 仅在预览时处理：按空格分割，过滤空字符串
              const nameArray = item.names.trim() ? item.names.split(/\s+/).filter(name => name.length > 0) : [];
              return (
                <div key={index} className="flex">
                  <span className="w-24 min-w-[6ch] font-medium text-left text-gray-800 dark:text-gray-200">{item.role ? `${item.role}:` : ''}</span>
                  <span className="flex-1 text-left text-gray-900 dark:text-gray-100">{nameArray.join(' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 调试信息 */}
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-xs border border-yellow-200 dark:border-yellow-800">
        <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">调试信息：</h5>
        <div className="text-yellow-700 dark:text-yellow-300">
          <p>当前输入状态（原始）：</p>
          <pre className="mt-1 whitespace-pre-wrap bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded text-yellow-900 dark:text-yellow-100">{JSON.stringify({ roles, bandName }, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}