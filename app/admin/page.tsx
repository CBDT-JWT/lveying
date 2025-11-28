'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (error) {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/guestbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-md w-full backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-lg">
            管理员登录
          </h1>
          <p className="text-gray-800 drop-shadow-md">请输入管理员密码</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-2 drop-shadow-md"
            >
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 bg-white/80 backdrop-blur-sm"
              placeholder="请输入管理员密码"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/80 text-white rounded-xl text-center font-medium backdrop-blur-sm drop-shadow-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-white/30 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all drop-shadow-md"
          >
            ← 返回主页
          </a>
        </div>
        
        {/* 制作信息 */}
        <div className="text-center mt-6">
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
