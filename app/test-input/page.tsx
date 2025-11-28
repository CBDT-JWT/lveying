// 简单测试演职人员编辑器
'use client';

import React, { useState } from 'react';

export default function TestInputPage() {
  const [inputValue, setInputValue] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('输入值改变:', `"${e.target.value}"`);
    setInputValue(e.target.value);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">测试输入框</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">原生输入框测试：</label>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="试试输入空格开头的文本"
          />
          <p className="text-xs text-gray-500 mt-1">
            当前值: "{inputValue}" (长度: {inputValue.length})
          </p>
        </div>
        
        <div>
          <h3 className="font-medium">测试结果：</h3>
          <ul className="text-sm text-gray-600">
            <li>• 输入前导空格测试: {inputValue.startsWith(' ') ? '✅ 成功' : '❌ 失败'}</li>
            <li>• 输入多个空格测试: {inputValue.includes('  ') ? '✅ 成功' : '❌ 无连续空格'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}