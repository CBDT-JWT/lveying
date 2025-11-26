import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';

// 禁用缓存，确保每次都获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 验证管理员权限
function verifyAdmin(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// GET - 获取抽奖配置（需要管理员权限）
export async function GET(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const config = dataStore.getLotteryConfig();
    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json(
      { error: '获取抽奖配置失败' },
      { status: 500 }
    );
  }
}

// POST - 更新抽奖配置（需要管理员权限）
export async function POST(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const config = await request.json();
    const updatedConfig = dataStore.updateLotteryConfig(config);

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error) {
    return NextResponse.json(
      { error: '更新抽奖配置失败' },
      { status: 500 }
    );
  }
}
