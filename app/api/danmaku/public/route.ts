import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

// 禁用缓存，确保每次都获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - 获取已审核的弹幕列表（公开访问，用于游客页面显示）
export async function GET() {
  try {
    const allDanmakus = dataStore.getDanmakus();
    // 只返回已审核的弹幕，按时间倒序排列，取最新的20条
    const approvedDanmakus = allDanmakus
      .filter(d => d.censor === true)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
    
  // 出于隐私原因，不返回 IP 地址给公众
  const publicDanmakus = approvedDanmakus.map(({ id, content, timestamp, censor, censoredAt }) => ({ id, content, timestamp, censor, censoredAt }));
  return NextResponse.json({ danmakus: publicDanmakus });
  } catch (error) {
    return NextResponse.json(
      { error: '获取弹幕失败' },
      { status: 500 }
    );
  }
}
