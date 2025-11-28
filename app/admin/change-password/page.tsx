'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // 验证输入
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }

    if (newPassword.length < 6) {
      setError('新密码至少需要6个字符');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('密码修改成功！');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // 3秒后返回控制台
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 3000);
      } else {
        setError(data.error || '密码修改失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-2xl mx-auto pt-8">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-lg">修改密码</h1>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl hover:bg-white/30 transition-all"
            >
              返回控制台
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前密码
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="请输入当前密码"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新密码
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="至少6个字符"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认新密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="再次输入新密码"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 backdrop-blur-md bg-white/20 border border-white/30 text-gray-800 rounded-xl font-semibold hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '修改中...' : '确认修改'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>注意：</strong>修改密码后需要重新登录。请妥善保管新密码。
            </p>
          </div>
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
