'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLotteryPage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到配置页面
    router.push('/admin/lottery/config');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">跳转中...</div>
    </div>
  );
}
