// 演职人员编辑器组件
'use client';

import React, { useState } from 'react';

interface PerformersEditorProps {
  performers?: [string | null, string[]][] | null;
  band_name?: string | null;
  onUpdate: (performers: [string | null, string[]][] | null, band_name: string | null) => void;
  className?: string;
}

export default function PerformersEditor({ performers, band_name, onUpdate, className = '' }: PerformersEditorProps) {
  const [localPerformers, setLocalPerformers] = useState<[string | null, string[]][]>(
    performers || []
  );
  const [localBandName, setLocalBandName] = useState<string>(band_name || '');
  
  // 存储每个角色的原始输入文本，允许用户自由输入空格
  const [nameInputTexts, setNameInputTexts] = useState<string[]>(() => {
    console.log('初始化 nameInputTexts，performers:', performers);
    return (performers || []).map(([, names]) => names.join(' '));
  });

  // 当props更新时，同步更新本地状态
  React.useEffect(() => {
    console.log('Props更新 - performers:', performers, 'band_name:', band_name);
    
    if (performers) {
      setLocalPerformers(performers);
      const newNameInputTexts = performers.map(([, names]) => names.join(' '));
      console.log('更新 nameInputTexts:', newNameInputTexts);
      setNameInputTexts(newNameInputTexts);
    }
    if (band_name !== undefined) {
      setLocalBandName(band_name || '');
    }
  }, [performers, band_name]);

  // 添加新的职务组
  const addRole = () => {
    const newPerformers = [...localPerformers, [null, []] as [string | null, string[]]];
    const newNameInputTexts = [...nameInputTexts, ''];
    setLocalPerformers(newPerformers);
    setNameInputTexts(newNameInputTexts);
    
    // 确保数组长度一致
    console.log('添加职务后 - performers长度:', newPerformers.length, 'nameInputTexts长度:', newNameInputTexts.length);
    
    onUpdate(newPerformers.length > 0 ? newPerformers : null, localBandName || null);
  };

  // 删除职务组
  const removeRole = (index: number) => {
    const newPerformers = localPerformers.filter((_, i) => i !== index);
    const newNameInputTexts = nameInputTexts.filter((_, i) => i !== index);
    setLocalPerformers(newPerformers);
    setNameInputTexts(newNameInputTexts);
    onUpdate(newPerformers.length > 0 ? newPerformers : null, localBandName || null);
  };

  // 更新职务名称
  const updateRole = (index: number, role: string) => {
    const newPerformers = [...localPerformers];
    newPerformers[index] = [role || null, newPerformers[index][1]];
    setLocalPerformers(newPerformers);
    onUpdate(newPerformers.length > 0 ? newPerformers : null, localBandName || null);
  };

  // 更新人名列表
  const updateNames = (roleIndex: number, namesText: string) => {
    console.log(`updateNames被调用 - roleIndex: ${roleIndex}, namesText: "${namesText}"`);
    console.log('当前 nameInputTexts长度:', nameInputTexts.length, '当前 localPerformers长度:', localPerformers.length);
    
    // 确保数组长度足够
    const newNameInputTexts = [...nameInputTexts];
    while (newNameInputTexts.length <= roleIndex) {
      newNameInputTexts.push('');
    }
    newNameInputTexts[roleIndex] = namesText;
    setNameInputTexts(newNameInputTexts);
    
    // 解析人名：允许前导空格，但在分割时处理
    let names: string[] = [];
    if (namesText.length > 0) {
      // 按一个或多个空格分割，但保留有意义的空字符串处理
      // 如果整个字符串只有空格，则返回空数组
      if (namesText.trim() === '') {
        names = [];
      } else {
        // 分割并过滤掉空字符串，但不预先trim整个输入
        names = namesText.split(/\s+/).filter(name => name.length > 0);
      }
    }
    
    const newPerformers = [...localPerformers];
    if (newPerformers[roleIndex]) {
      newPerformers[roleIndex] = [newPerformers[roleIndex][0], names];
    }
    setLocalPerformers(newPerformers);
    onUpdate(newPerformers.length > 0 ? newPerformers : null, localBandName || null);
  };

  // 更新组合名
  const updateBandName = (name: string) => {
    setLocalBandName(name);
    onUpdate(localPerformers.length > 0 ? localPerformers : null, name || null);
  };

  return (
    <div className={`performers-editor space-y-4 ${className}`}>
      {/* 组合名编辑 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          组合名（可选）
        </label>
        <input
          type="text"
          value={localBandName}
          onChange={(e) => updateBandName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="如：舞蹈团、合唱团等"
        />
      </div>

      {/* 演职人员编辑 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            演职人员
          </label>
          <button
            onClick={addRole}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            + 添加职务
          </button>
        </div>

        <div className="space-y-3">
            {localPerformers.map(([role, names], index) => (
              <div key={index} className="flex gap-2 items-start">
              {/* 职务名称 */}
              <div className="w-24">
                <input
                  type="text"
                  value={role || ''}
                  onChange={(e) => updateRole(index, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="职务"
                />
              </div>
              
              {/* 人名列表 */}
              <div className="flex-1">
                <input
                  type="text"
                  value={nameInputTexts[index] || ''}
                  onChange={(e) => updateNames(index, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="人名（用空格分隔）"
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示：多个人名用空格分隔，如&quot;张三 李四 王五&quot;。可以先输入空格。
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
          
          {localPerformers.length === 0 && (
            <p className="text-gray-500 text-sm py-4 text-center border border-dashed border-gray-300 rounded-lg">
              暂无演职人员，点击上方&quot;添加职务&quot;按钮开始添加
            </p>
          )}
        </div>
      </div>

      {/* 预览 */}
      {(localPerformers.length > 0 || localBandName) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">预览效果：</h4>
          <div className="text-sm">
            {localBandName && (
              <div className="font-semibold mb-1">{localBandName}</div>
            )}
            {localPerformers.map(([role, names], index) => (
              <div key={index} className="flex">
                <span className="w-24 min-w-[6ch] font-medium text-left">{role ? `${role}:` : ''}</span>
                <span className="flex-1 text-left">{names.join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}