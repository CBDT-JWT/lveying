// 测试PerformersEditor的输入行为
'use client';

import React, { useState } from 'react';
import PerformersEditor from '@/components/PerformersEditor';

export default function TestPerformersEditor() {
  const [performers, setPerformers] = useState<[string | null, string[]][] | null>(null);
  const [bandName, setBandName] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">演职人员编辑器测试</h1>
      
      <PerformersEditor
        performers={performers}
        band_name={bandName}
        onUpdate={(newPerformers, newBandName) => {
          setPerformers(newPerformers);
          setBandName(newBandName);
        }}
      />
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">当前数据:</h3>
        <pre className="text-sm">{JSON.stringify({ performers, bandName }, null, 2)}</pre>
      </div>
      
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <h3 className="font-bold mb-2">测试说明:</h3>
        <p className="text-sm">
          1. 点击"添加职务"<br/>
          2. 在人名输入框中先输入几个空格<br/>
          3. 然后输入人名<br/>
          4. 观察是否可以保持前导空格
        </p>
      </div>
    </div>
  );
}