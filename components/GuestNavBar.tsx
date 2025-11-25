'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function GuestNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleRefresh = () => {
    window.location.reload();
  };

  const navItems = [
    { icon: '/home.png', label: '主页', href: '/' },
    { icon: '/programs.png', label: '节目', href: '/programs' },
    { icon: '/lottery.png', label: '抽奖', href: '/lottery' },
    { icon: '/chat.png', label: '弹幕', href: '/danmaku' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 backdrop-blur-lg bg-white/20 border-b border-white/30 shadow-lg z-50">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="hover:scale-110 transition-transform flex items-center justify-center w-12 h-12 relative z-10"
          title="返回"
        >
          <Image src="/return.png" alt="返回" width={32} height={32} className="object-contain drop-shadow-lg" />
        </button>

        {/* 导航按钮 */}
        <div className="flex gap-3 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-all flex items-center justify-center w-12 h-12 relative z-10 ${
                pathname === item.href
                  ? 'scale-125 drop-shadow-2xl'
                  : 'hover:scale-110 drop-shadow-lg'
              }`}
              title={item.label}
            >
              <Image src={item.icon} alt={item.label} width={32} height={32} className="object-contain" />
            </Link>
          ))}
        </div>

        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          className="hover:scale-110 transition-transform flex items-center justify-center w-12 h-12 relative z-10"
          title="刷新"
        >
          <Image src="/refresh.png" alt="刷新" width={32} height={32} className="object-contain drop-shadow-lg" />
        </button>
      </div>
    </div>
  );
}
