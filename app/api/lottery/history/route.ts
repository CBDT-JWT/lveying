import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';

// 验证管理员权限
function verifyAdmin(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// GET - 获取所有抽奖历史（公开访问，游客也可以查看）
export async function GET() {
  try {
    const results = dataStore.getAllLotteryResults();
    return NextResponse.json({ history: results });
  } catch (error) {
    return NextResponse.json(
      { error: '获取抽奖历史失败' },
      { status: 500 }
    );
  }
}

// DELETE - 清空所有抽奖历史（需要管理员权限）
export async function DELETE(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    dataStore.clearAllLotteryResults();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '清空抽奖历史失败' },
      { status: 500 }
    );
  }
}
