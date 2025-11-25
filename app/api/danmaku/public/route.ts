import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

// GET - 获取已审核的弹幕列表（公开访问，用于游客页面显示）
export async function GET() {
  try {
    const allDanmakus = dataStore.getDanmakus();
    // 只返回已审核的弹幕，按时间倒序排列，取最新的8条
    const approvedDanmakus = allDanmakus
      .filter(d => d.censor === true)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);
    
    return NextResponse.json({ danmakus: approvedDanmakus });
  } catch (error) {
    return NextResponse.json(
      { error: '获取弹幕失败' },
      { status: 500 }
    );
  }
}
