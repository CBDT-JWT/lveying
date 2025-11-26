'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">验证中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              🎉 管理员控制台
            </h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/programs"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 text-white"
          >
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-2">节目管理</h2>
            <p className="text-green-100">管理节目单和节目进度</p>
          </Link>

          <Link
            href="/admin/danmaku"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 text-white"
          >
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl font-bold mb-2">弹幕管理</h2>
            <p className="text-blue-100">查看和管理用户弹幕</p>
          </Link>

          <Link
            href="/admin/lottery/config"
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 text-white"
          >
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold mb-2">抽奖设置</h2>
            <p className="text-purple-100">配置抽奖参数和查看历史</p>
          </Link>

          <a
            href="/admin/lottery/display"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 text-white"
          >
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold mb-2">抽奖大屏</h2>
            <p className="text-pink-100">全屏抽奖界面（新窗口）</p>
          </a>

          <a
            href="/display"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 text-white"
          >
            <div className="text-5xl mb-4">📺</div>
            <h2 className="text-2xl font-bold mb-2">弹幕大屏</h2>
            <p className="text-gray-200">全屏显示已审核弹幕</p>
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 text-white"
          >
            <div className="text-5xl mb-4">👀</div>
            <h2 className="text-2xl font-bold mb-2">预览Guest端</h2>
            <p className="text-orange-100">查看用户看到的页面</p>
          </a>
        </div>
        
        {/* 制作信息 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-300">
            © 2025 <a href="https://www.jiangwt.org" target="_blank" rel="noopener noreferrer" className="hover:underline">江玮陶</a>
            {' | '}
            <a href="https://github.com/CBDT-JWT/lveying" target="_blank" rel="noopener noreferrer" className="hover:underline">Github</a>
          </p>
        </div>
      </div>
    </div>
  );
}
