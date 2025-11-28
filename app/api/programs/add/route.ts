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

// POST - 添加新节目（需要管理员权限）
export async function POST(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { title, performers, band_name, order, parentId, subOrder } = await request.json();
    
    if (!title || order === undefined) {
      return NextResponse.json(
        { error: '节目标题和顺序不能为空' },
        { status: 400 }
      );
    }

    const newProgram = dataStore.addProgram(title, order, performers, band_name, parentId, subOrder);

    return NextResponse.json({ success: true, program: newProgram });
  } catch (error) {
    return NextResponse.json(
      { error: '添加节目失败' },
      { status: 500 }
    );
  }
}
