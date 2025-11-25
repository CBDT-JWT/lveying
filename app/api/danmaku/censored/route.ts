import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

// GET - 获取已审核的弹幕（公开接口）
export async function GET() {
  try {
    const danmakus = dataStore.getCensoredDanmakus();
    return NextResponse.json({ danmakus });
  } catch (error) {
    return NextResponse.json(
      { error: '获取弹幕失败' },
      { status: 500 }
    );
  }
}
