'use client';

import React from 'react';
import ProgramPerformersDisplay from '@/components/ProgramPerformersDisplay';

export default function TestDisplayPage() {
  // 测试数据
  const testCases = [
    {
      title: "标准格式 - 有职务",
      performers: [
        ["指挥", ["张三"]],
        ["钢琴", ["李四", "王五"]]
      ] as [string | null, string[]][],
      band_name: "北京大学交响乐团"
    },
    {
      title: "特殊格式 - 无职务单列表",
      performers: [
        [null, ["张三", "李四", "王五", "赵六"]]
      ] as [string | null, string[]][],
      band_name: "北京大学合唱团"
    },
    {
      title: "特殊格式 - 空职务单列表",
      performers: [
        ["", ["小明", "小红", "小刚"]]
      ] as [string | null, string[]][],
      band_name: "学生乐队"
    },
    {
      title: "只有组名",
      performers: null,
      band_name: "独奏表演"
    },
    {
      title: "混合格式 - 不符合特殊条件",
      performers: [
        [null, ["张三", "李四"]],
        ["钢琴", ["王五"]]
      ] as [string | null, string[]][],
      band_name: "混合乐团"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">演职人员显示测试</h1>
        
        <div className="space-y-6">
          {testCases.map((testCase, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                {testCase.title}
              </h2>
              
              {/* 显示测试数据 */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">测试数据：</h3>
                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {JSON.stringify({
                    performers: testCase.performers,
                    band_name: testCase.band_name
                  }, null, 2)}
                </pre>
              </div>
              
              {/* 渲染效果 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded p-4 bg-white/80 backdrop-blur-md">
                <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">渲染效果：</h3>
                <ProgramPerformersDisplay 
                  performers={testCase.performers}
                  band_name={testCase.band_name}
                  className="text-sm drop-shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">说明：</h2>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>特殊格式条件：</strong>performers只有一个元素且没有职务（null或空字符串）</li>
            <li>• <strong>特殊格式显示：</strong>组名（加粗）换行 名字列表</li>
            <li>• <strong>标准格式：</strong>职务: 名字列表 的形式</li>
            <li>• <strong>文字颜色：</strong>强制为黑色，不受深色模式影响</li>
          </ul>
        </div>
      </div>
    </div>
  );
}