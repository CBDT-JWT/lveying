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
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/guestbg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-gray-800 text-xl font-semibold drop-shadow-lg backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 p-8">
          验证中...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: 'url(/guestbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-lg">
              管理员控制台
            </h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl hover:bg-white/30 transition-all shadow-lg"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/programs"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">节目管理</h2>
            <p className="text-gray-700 drop-shadow-md">管理节目单和节目进度</p>
          </Link>

          <Link
            href="/admin/danmaku"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">弹幕管理</h2>
            <p className="text-gray-700 drop-shadow-md">查看和管理用户弹幕</p>
          </Link>

          <Link
            href="/admin/lottery/config"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">抽奖设置</h2>
            <p className="text-gray-700 drop-shadow-md">配置抽奖参数和查看历史</p>
          </Link>

          <Link
            href="/admin/change-password"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">修改密码</h2>
            <p className="text-gray-700 drop-shadow-md">更改管理员登录密码</p>
          </Link>

          <a
            href="/admin/lottery/display"
            target="_blank"
            rel="noopener noreferrer"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">抽奖大屏</h2>
            <p className="text-gray-700 drop-shadow-md">全屏抽奖界面（新窗口）</p>
          </a>

          <a
            href="/display"
            target="_blank"
            rel="noopener noreferrer"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">弹幕大屏</h2>
            <p className="text-gray-700 drop-shadow-md">全屏显示已审核弹幕</p>
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 transform hover:scale-105 transition-all p-8 text-gray-800"
          >
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">预览Guest端</h2>
            <p className="text-gray-700 drop-shadow-md">查看用户看到的页面</p>
          </a>
        </div>
        
        {/* 制作信息 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-800 drop-shadow-md">
            © 2025 <a href="https://www.jiangwt.org" target="_blank" rel="noopener noreferrer" className="hover:underline">江玮陶</a>
            {' | '}
            <a href="https://github.com/CBDT-JWT/lveying" target="_blank" rel="noopener noreferrer" className="hover:underline">Github</a>
          </p>
        </div>
      </div>
    </div>
  );
}
