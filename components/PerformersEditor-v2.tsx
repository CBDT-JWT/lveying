// 演职人员编辑器组件 - 重构版本
'use client';

import React, { useState, useEffect } from 'react';

interface PerformersEditorProps {
  performers?: [string | null, string[]][] | null;
  band_name?: string | null;
  onUpdate: (performers: [string | null, string[]][] | null, band_name: string | null) => void;
  className?: string;
}

// 导出接口供父组件使用
export interface PerformersEditorRef {
  save: () => void;
}

const PerformersEditor = React.forwardRef<PerformersEditorRef, PerformersEditorProps>(
  ({ performers, band_name, onUpdate, className = '' }, ref) => {
  // 本地状态管理
  const [roles, setRoles] = useState<Array<{ role: string; names: string }>>([]);
  const [bandName, setBandName] = useState<string>('');

  // 初始化状态
  useEffect(() => {
    console.log('初始化 - performers:', performers, 'band_name:', band_name);
    
    // 初始化角色和姓名
    if (performers && performers.length > 0) {
      const initialRoles = performers.map(([role, names]) => ({
        role: role || '',
        names: names.join(' ')
      }));
      setRoles(initialRoles);
    } else {
      setRoles([]);
    }
    
    // 初始化乐队名
    setBandName(band_name || '');
  }, [performers, band_name]);

  // 转换本地状态为数据格式并通知父组件
  const updateParent = (newRoles: Array<{ role: string; names: string }>, newBandName: string) => {
    const performersData: [string | null, string[]][] = newRoles.map(({ role, names }) => {
      // 解析姓名：按空格分割，过滤空字符串
      const nameArray = names.trim() ? names.split(/\s+/).filter(name => name.length > 0) : [];
      return [role || null, nameArray];
    });

    const finalPerformers = performersData.length > 0 ? performersData : null;
    const finalBandName = newBandName.trim() || null;
    
    console.log('更新父组件 - performers:', finalPerformers, 'bandName:', finalBandName);
    onUpdate(finalPerformers, finalBandName);
  };

  // 添加新角色
  const addRole = () => {
    const newRoles = [...roles, { role: '', names: '' }];
    setRoles(newRoles);
    updateParent(newRoles, bandName);
  };

  // 删除角色
  const removeRole = (index: number) => {
    const newRoles = roles.filter((_, i) => i !== index);
    setRoles(newRoles);
    updateParent(newRoles, bandName);
  };

  // 更新角色名称 - 不做任何处理，直接保存用户输入
  const updateRole = (index: number, newRole: string) => {
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], role: newRole };
    setRoles(newRoles);
    // 注意：这里不调用 updateParent，避免实时处理
  };

  // 更新姓名 - 不做任何处理，直接保存用户输入
  const updateNames = (index: number, newNames: string) => {
    console.log(`更新姓名 - index: ${index}, names: "${newNames}"`);
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], names: newNames };
    setRoles(newRoles);
    // 注意：这里不调用 updateParent，避免实时处理
  };

  // 更新乐队名 - 不做任何处理，直接保存用户输入
  const updateBandName = (newBandName: string) => {
    setBandName(newBandName);
    // 注意：这里不调用 updateParent，避免实时处理
  };

  // 暴露给父组件的保存方法
  React.useImperativeHandle(ref, () => ({
    save: () => {
      updateParent(roles, bandName);
    }
  }));

  return (
    <div className={`performers-editor space-y-4 ${className}`}>
      {/* 组合名编辑 */}
      <div>
        <label className="block text-sm font-medium mb-1">组合名（可选）：</label>
        <input
          type="text"
          value={bandName}
          onChange={(e) => updateBandName(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="例如：北京大学合唱团"
        />
      </div>

      {/* 演职人员编辑 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">演职人员：</label>
          <button
            onClick={addRole}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            添加职务
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((item, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 rounded-lg">
              {/* 职务输入 */}
              <div className="w-24">
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => updateRole(index, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="职务"
                />
              </div>

              {/* 姓名输入 */}
              <div className="flex-1">
                <input
                  type="text"
                  value={item.names}
                  onChange={(e) => updateNames(index, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="人名（用空格分隔）"
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示：多个人名用空格分隔。可以在任何位置输入空格。
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
            <p className="text-gray-500 text-sm py-4 text-center border border-dashed border-gray-300 rounded-lg">
              暂无演职人员，点击上方&quot;添加职务&quot;按钮开始添加
            </p>
          )}
        </div>
      </div>

      {/* 预览 */}
      {(roles.length > 0 || bandName) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">预览效果：</h4>
          <div className="text-sm">
            {bandName && (
              <div className="font-semibold mb-1">{bandName}</div>
            )}
            {roles.map((item, index) => {
              const nameArray = item.names.trim() ? item.names.split(/\s+/).filter(name => name.length > 0) : [];
              return (
                <div key={index} className="flex">
                  <span className="w-24 min-w-[6ch] font-medium text-left">{item.role ? `${item.role}:` : ''}</span>
                  <span className="flex-1 text-left">{nameArray.join(' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

PerformersEditor.displayName = 'PerformersEditor';

export default PerformersEditor;