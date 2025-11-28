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

// GET - 获取弹幕列表（需要管理员权限）
export async function GET(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const danmakus = dataStore.getDanmakus();
    return NextResponse.json({ danmakus });
  } catch (error) {
    return NextResponse.json(
      { error: '获取弹幕失败' },
      { status: 500 }
    );
  }
}

// POST - 发送弹幕（guest端）
export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '弹幕内容不能为空' },
        { status: 400 }
      );
    }

    if (content.length > 100) {
      return NextResponse.json(
        { error: '弹幕内容不能超过100个字符' },
        { status: 400 }
      );
    }

    const danmaku = dataStore.addDanmaku(content.trim());
    return NextResponse.json({ success: true, danmaku });
  } catch (error) {
    return NextResponse.json(
      { error: '发送弹幕失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除弹幕（需要管理员权限）
export async function DELETE(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // 如果没有传id，则清空所有弹幕
    if (!body.id) {
      dataStore.clearDanmakus();
      return NextResponse.json({ success: true });
    }
    
    // 删除单个弹幕
    const success = dataStore.deleteDanmaku(body.id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '弹幕不存在' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '删除弹幕失败' },
      { status: 500 }
    );
  }
}

// PATCH - 更新弹幕审核状态（需要管理员权限）
export async function PATCH(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { id, censor } = await request.json();

    if (!id || typeof censor !== 'boolean') {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      );
    }

    const success = dataStore.updateDanmakuCensor(id, censor);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '弹幕不存在' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '更新审核状态失败' },
      { status: 500 }
    );
  }
}


