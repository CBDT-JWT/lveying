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

// GET - 获取抽奖结果（guest端 - 返回最新结果）
export async function GET() {
  try {
    const result = dataStore.getLatestLotteryResult();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: '获取抽奖结果失败' },
      { status: 500 }
    );
  }
}

// POST - 添加新的抽奖结果（需要管理员权限）
export async function POST(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { title, numbers } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: '请提供奖项名称' },
        { status: 400 }
      );
    }

    if (!Array.isArray(numbers)) {
      return NextResponse.json(
        { error: '无效的抽奖结果' },
        { status: 400 }
      );
    }

    const result = dataStore.addLotteryResult(title, numbers);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: '添加抽奖结果失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除指定抽奖结果（需要管理员权限）
export async function DELETE(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: '请提供抽奖结果ID' },
        { status: 400 }
      );
    }

    const success = dataStore.deleteLotteryResult(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '抽奖结果不存在' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '删除抽奖结果失败' },
      { status: 500 }
    );
  }
}
